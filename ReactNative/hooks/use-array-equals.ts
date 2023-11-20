
export const useArrayEquals = () => {

    const arraysAreEqual = (arr1: string | any[], arr2: string | any[]) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (!objectsAreEqual(arr1[i], arr2[i])) {
                return false;
            }
        }

        return true;
    }

    const objectsAreEqual = (obj1: { [x: string]: any; }, obj2: { [x: string]: any; }) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    return { arraysAreEqual }
}



