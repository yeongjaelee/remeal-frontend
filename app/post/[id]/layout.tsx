"use client";
import React, {useEffect, useState} from "react";
export default function Layout({children,}: {
    children: React.ReactNode,
}) {
    return (
        <div>
            {children}
        </div>
    );
}