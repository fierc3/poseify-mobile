import * as THREE from 'three';

/*
 Based on BvhImporta.JS by Ivo Herzig, 2016 (MIT LIcense)
 https://github.com/herzig/BVHImporter
*/


type Offset = { x: number; y: number; z: number };
type Keyframe = {
    time: number;
    position: Offset;
    rotation: Quat;
};

interface Node {
    name: string;
    type: string;
    frames: Keyframe[];
    offset: Offset;
    channels: string[];
    children: Node[];
}

class Quat {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    setFromAxisAngle(ax: number, ay: number, az: number, angle: number): void {
        const angleHalf = angle * 0.5;
        const sin = Math.sin(angleHalf);

        this.x = ax * sin;
        this.y = ay * sin;
        this.z = az * sin;
        this.w = Math.cos(angleHalf);
    }

    multiply(quat: Quat): void {
        const a = this, b = quat;
        const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    }
}

/* 
    traverses the node hierarchy and builds a flat list of nodes	
*/
function flatten(bone: Node, flatList: Node[]) {
    flatList.push(bone);

    if (bone.type !== "ENDSITE") {
        for (var i = 0; i < bone.children.length; ++i) {
            flatten(bone.children[i], flatList);
        }
    }
}


class BVHImport {
    /*
      Converts BVH skeletal animation data to THREE.Bones and a THREE.AnimationClip.
    */
    toTHREE(bone: Node): { skeleton: THREE.Skeleton; clip: THREE.AnimationClip } {
        const threeBones: THREE.Bone[] = [];
        this.toTHREEBone(bone, threeBones);

        return {
            skeleton: new THREE.Skeleton(threeBones),
            clip: this.toTHREEAnimation(bone)
        };
    }

    private toTHREEBone(source: Node, list: THREE.Bone[]): THREE.Bone {
        const bone = new THREE.Bone();
        list.push(bone);
        if (source.offset) {
            bone.position.add(new THREE.Vector3(source.offset.x, source.offset.y, source.offset.z));
        }
        bone.name = source.name;

        if (source.type !== "ENDSITE" && source.children) {
            for (const child of source.children) {
                bone.add(this.toTHREEBone(child, list));
            }
        }

        return bone;
    }

    private toTHREEAnimation(bone: Node): THREE.AnimationClip {
        const bones: Node[] = [];
        flatten(bone, bones);

        const tracks: THREE.KeyframeTrack[] = [];

        for (const b of bones) {
            if (b.type === "ENDSITE") continue;

            const times: number[] = [];
            const positions: number[] = [];
            const rotations: number[] = [];

            for (const frame of b.frames) {
                times.push(frame.time);
                if (b.offset) {
                    positions.push(frame.position.x + b.offset.x);
                    positions.push(frame.position.y + b.offset.y);
                    positions.push(frame.position.z + b.offset.z);
                }

                rotations.push(frame.rotation.x, frame.rotation.y, frame.rotation.z, frame.rotation.w);
            }

            tracks.push(new THREE.VectorKeyframeTrack(`.bones[${b.name}].position`, times, positions));
            tracks.push(new THREE.QuaternionKeyframeTrack(
                ".bones[" + b.name + "].quaternion", times, rotations));
        }

        var clip = new THREE.AnimationClip("animation", -1, tracks);

        return clip;
    }

    /*
    reads a BVH file
    */
    public readBvh(lines: string[]) {

        // read model structure
        if ((lines.shift() ?? '').trim().toUpperCase() != "HIERARCHY")
            throw "HIERARCHY expected";

        var list: Node[] = [];
        var root = this.readNode(lines, (lines.shift() ?? '').trim(), list);

        // read motion data
        if ((lines.shift() ?? '').trim().toUpperCase() != "MOTION")
            throw "MOTION  expected";

        var tokens = (lines.shift() ?? '').trim().split(/[\s]+/);

        // number of frames
        var numFrames = parseInt(tokens[1]);
        if (isNaN(numFrames))
            throw "Failed to read number of frames.";

        // frame time
        tokens = (lines.shift() ?? '').trim().split(/[\s]+/);
        var frameTime = parseFloat(tokens[2]);
        if (isNaN(frameTime))
            throw "Failed to read frame time.";

        // read frame data line by line
        for (var i = 0; i < numFrames; ++i) {
            tokens = (lines.shift() ?? '').trim().split(/[\s]+/);

            this.readFrameData(tokens, i * frameTime, root);
        }

        return root;
    }

    /*
     Recursively parses the HIERACHY section of the BVH file
    	
     - lines: all lines of the file. lines are consumed as we go along.
     - firstline: line containing the node type and name e.g. "JOINT hip"
     - list: collects a flat list of nodes
	
     returns: a BVH node including children
    */
    private readNode(lines: string[], firstline: string, list: Node[]) {
        var node: Node = { name: "", type: "", frames: [], channels: [], children: [], offset: {x:0,y:0,z:0} };
        list.push(node);

        // parse node tpye and name.
        var tokens = firstline.trim().split(/[\s]+/)

        if (tokens[0].toUpperCase() === "END" && tokens[1].toUpperCase() === "SITE") {
            node.type = "ENDSITE";
            node.name = "ENDSITE"; // bvh end sites have no name
        }
        else {
            node.name = tokens[1];
            node.type = tokens[0].toUpperCase();
        }

        // opening bracket
        if ((lines.shift() ?? '').trim() != "{")
            throw "Expected opening { after type & name";

        // parse OFFSET 
        tokens = (lines.shift() ?? '').trim().split(/[\s]+/);

        if (tokens[0].toUpperCase() != "OFFSET")
            throw "Expected OFFSET, but got: " + tokens[0];
        if (tokens.length != 4)
            throw "OFFSET: Invalid number of values";

        var offset = {
            x: parseFloat(tokens[1]), y: parseFloat(tokens[2]), z: parseFloat(tokens[3])
        };

        if (isNaN(offset.x) || isNaN(offset.y) || isNaN(offset.z))
            throw "OFFSET: Invalid values";

        node.offset = offset;

        // parse CHANNELS definitions
        if (node.type != "ENDSITE") {
            tokens = (lines.shift() ?? '').trim().split(/[\s]+/);

            if (tokens[0].toUpperCase() != "CHANNELS")
                throw "Expected CHANNELS definition";

            var numChannels = parseInt(tokens[1]);
            node.channels = tokens.splice(2, numChannels);
            node.children = [];
        }

        // read children
        while (true) {
            var line = (lines.shift() ?? '').trim();

            if (line == "}") {
                return node;
            }
            else {
                
                node.children.push(this.readNode(lines, line, list));
            }
        }
    }

    /*
         Recursively reads data from a single frame into the bone hierarchy.
         The bone hierarchy has to be structured in the same order as the BVH file.
         keyframe data is stored in bone.frames.
	
         - data: splitted string array (frame values), values are shift()ed so
         this should be empty after parsing the whole hierarchy.
         - frameTime: playback time for this keyframe.
         - bone: the bone to read frame data from.
    */
    private readFrameData(data: string[], frameTime: number, bone: Node ) {

        if (bone.type === "ENDSITE") // end sites have no motion data
            return;

        // add keyframe
        var keyframe = {
            time: frameTime,
            position: { x: 0, y: 0, z: 0 },
            rotation: new Quat(),
        };

        bone.frames.push(keyframe);

        // parse values for each channel in node
        for (var i = 0; i < (bone.channels ?? []).length; ++i) {
              switch (bone.channels[i]) {
                case "Xposition":
                    keyframe.position.x = parseFloat((data.shift() ?? '').trim());
                    break;
                case "Yposition":
                    keyframe.position.y = parseFloat((data.shift() ?? '').trim());
                    break;
                case "Zposition":
                    keyframe.position.z = parseFloat((data.shift() ?? '').trim());
                    break;
                case "Xrotation":
                    var quat = new Quat();
                    quat.setFromAxisAngle(1, 0, 0, parseFloat((data.shift() ?? '').trim()) * Math.PI / 180);

                    keyframe.rotation.multiply(quat);
                    break;
                case "Yrotation":
                    var quat = new Quat();
                    quat.setFromAxisAngle(0, 1, 0, parseFloat((data.shift() ?? '')) * Math.PI / 180);

                    keyframe.rotation.multiply(quat);
                    break;
                case "Zrotation":
                    var quat = new Quat();
                    quat.setFromAxisAngle(0, 0, 1, parseFloat((data.shift() ?? '')) * Math.PI / 180);

                    keyframe.rotation.multiply(quat);
                    break;
                default:
                    throw "invalid channel type";
                    break;
            }
        }

        // parse child nodes
        for (var i = 0; i < bone.children.length; ++i) {
            this.readFrameData(data, frameTime, bone.children[i]);
        }
    }

}

export { BVHImport }
