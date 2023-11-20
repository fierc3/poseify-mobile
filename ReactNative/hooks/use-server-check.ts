import { useEffect, useState } from "react";
import { isServerUp as isServerUpApi } from "../helpers/api";
import { ServerStatus } from "../helpers/api.types";

export const useServerCheck = () => {

    const [isServerUp, setIsServerUp] = useState<ServerStatus>('Unknown');

    useEffect(() => {
        const check = async () => setIsServerUp(await isServerUpApi());
        check()
    }, [])

    return { isServerUp }
}