import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import logo from "../assets/Images/mauro-davoli.png";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex space-x-5">
        <Link href="/">
          <Image
            width={50}
            height={50}
            className="rounded-full object-contain cursor-pointer"
            src={logo}
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5 text-slate-800 dark:text-white ">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className=" bg-slate-500 px-4 py-1 rounded-full">Follow</h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-slate-800 dark:text-white">
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            checked={theme === "dark"}
            type="checkbox"
            className="sr-only peer"
            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Toggle me
          </span>
        </label>
        <h3
          onClick={() => window.open("https://www.buymeacoffee.com/mdavoli97")}
          className="border px-4 py-1 rounded-full border-slate-800 dark:border-white cursor-pointer"
        >
          Buy me a coffee
        </h3>
      </div>
    </header>
  );
};

export default Header;
