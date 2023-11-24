import { useEffect, useState } from "react";
import { isServerUp as isServerUpApi } from "../helpers/api";
import { ServerStatus } from "../helpers/api.types";

export const useServerCheck = () => {

    const [isServerUp, setIsServerUp] = useState<ServerStatus>('Unknown');

    const check = async () => setIsServerUp(await isServerUpApi());

    useEffect(() => {
        check()
    }, [])

    return { isServerUp, checkServer: check }
}