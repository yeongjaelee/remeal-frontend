"use client";
import './globals.css'
import NavLayout from "./nav/NavLayout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";
import {Providers} from "./GlobalRedux/provider";

config.autoAddCss = false;

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <div id="modal" className="w-screen h-screen">
          <ApolloProvider client={client}>
              <div className="h-12 w-screen border-black border-b justify-center items-center">
                  <div className="flex items-center justify-center h-12">
                      <div className="w-mainLayout h-12">

                          <NavLayout />
                      </div>

                  </div>

                  {/*<LeftSideBar />*/}
                  <Providers>
                      {children}
                  </Providers>

              </div>
          </ApolloProvider>
      </div>
      </body>
    </html>
  )
}
