"use client";
import './globals.css'
import NavLayout from "./nav/NavLayout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";
import LeftSideBar from "./nav/LeftSideBar";
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
      <div id="modal" className="w-screen h-screen bg-gray-400 flex justify-items-center items-center justify-center">
          <ApolloProvider client={client}>
              <div className="h-screen bg-gray-200 w-9/12">
                  <NavLayout />
                  {/*<LeftSideBar />*/}
                  {children}
              </div>
          </ApolloProvider>
      </div>
      </body>
    </html>
  )
}
