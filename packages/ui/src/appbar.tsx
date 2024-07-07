import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}
const openLink = () => {
    const newTab = window.open('http://localhost:3001');
    if (newTab) {
        newTab.focus();
    }
};
export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4">
        <div className="text-lg flex flex-col justify-center">
            PayTM
        </div>
        <div className="flex justify-between items-center pt-4 ">
        <div className="flex flex-col justify-end">
                <button
                    onClick={openLink}
                    className="text-blue-600 bg-transparent hover:bg-gray-100 border border-gray-300 rounded-md px-4 py-2 font-serif"
                >
                    Merchant login
                </button>
            </div>
        <div className="flex flex-col justify-end pl-2 pt-1">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
            </div>
        </div>
    </div>
}