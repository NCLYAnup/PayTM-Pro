import { useRecoilValue } from "recoil";
import { transferState } from "../atoms/transferState"

export const usetransfer = () => {
    const value = useRecoilValue(transferState);
    return value;
}   