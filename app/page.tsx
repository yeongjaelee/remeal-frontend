import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="text-xl text-red-600">Hello World</div>
    </div>
  );
}
