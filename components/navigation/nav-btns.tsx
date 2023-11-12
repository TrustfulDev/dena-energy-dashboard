import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { SheetClose } from "@/components/ui/sheet";

/*  [Props For Our Navigation Button]
*
*   Icon, Text, Link:   Information needed for display
*   Active:             State that indicates if the button is for the current tab
*   className:          Add any extra styling
*   withSheetClose?:    SPECIFICALLY used for the mobile-nav.tsx | Not a mandatory prop
*/
interface NavBtnProps {
    Icon: LucideIcon;
    text: String;
    link: String;
    active: Boolean;
    className: String;
    withSheetClose?: boolean;
}

export const NavBtn: React.FC<NavBtnProps> = ({
    Icon,
    text,
    link,
    active,
    className,
    withSheetClose
}) => {
    // Determine whether we need SheetClose for our wrapper
    const [SheetCloseWrapper, sheetCloseWrapperProps] = withSheetClose
    ? [SheetClose, { asChild: true }]
    : [React.Fragment, {}];

    return (
        <SheetCloseWrapper {...sheetCloseWrapperProps}>
            <Button variant="left" className={`hover:bg-primary-card hover:text-primary-text text-base py-7 ${active ? "text-primary-text bg-primary-card" : "text-faded-text"} ${className}`} asChild>
                <Link href={`${link}`} type="button"><Icon className="mr-3 h-5 w-5" /> {text}</Link>
            </Button>
        </SheetCloseWrapper>
    )
}