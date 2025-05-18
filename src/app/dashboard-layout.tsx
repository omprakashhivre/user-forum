'use client'

import Navbar from '@/components/navbar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserProvider } from '../hooks/useUserContext';
interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: any;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }: DashboardLayoutProps) => {
    const [name, setName] = useState("X");
    const [email, setEmail] = useState("X");
    const [id, setId] = useState("X");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setName(sessionStorage.getItem("name") || "X");
            setEmail(sessionStorage.getItem("email") || "X");
            setId(sessionStorage.getItem("id") || "X");
        }
    }, []);
    // const isCollapse = useSelector((state: any) => state.constant?.isCollapse)
    // const screenWidth = useSelector((state: any) => state.dashboard.screenWidth)
    // // const isCollapsed = useSelector((state: any) => state.constant.isCollapse);
    // const dispatch = useDispatch()
    // const [sidebarWidth, setSidebarWidth] = useState<number>(201.75);
    // const [isCollapsed, setIsCollapsed] = useState(false);
    // const [screenWidth, setScreenWidth] = useState<any>(null)

    // useEffect(() => {
    //     const updateScreenWidth = () => dispatch(setScreenWidth(window.innerWidth));
    //     updateScreenWidth(); // Set initial width
    //     window.addEventListener('resize', updateScreenWidth);
    //     return () => {
    //         window.removeEventListener('resize', updateScreenWidth);
    //     };
    // }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full min-h-screen border flex flex-col">
            {/* <UserProvider value={{ name, id, email }}> */}
            {/* <ProtectedRoute> */}
            <Navbar name={name} id={id} email={email} />

            <main
                className="flex-1 overflow-none pt-4 pb-6 px-2 flex justify-center"
                style={{
                    maxHeight: "100dvh",
                }}
            >
                <div className="w-full max-w-4xl min-w-[100%] px-4">
                    {children}
                </div>
            </main>
        </div>

    );
};
export default DashboardLayout;
// export default isAuth(DashboardLayout);