"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const client = new QueryClient()

const Provider = ({children}:PropsWithChildren<{}>) => {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}
export default Provider;