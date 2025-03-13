import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="flex h-[80vh] w-full items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 dark:text-white">
      {/* Hero Content */}

      <div className="flex max-w-5xl flex-col gap-6 px-6 text-center md:px-12">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Make an Impact. One Volunteer at a Time.
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Join thousands of volunteers helping communities through meaningful
          actions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to={"/signup"}
            className="rounded-lg border-2 border-black bg-transparent px-4 py-2 text-lg font-semibold text-black transition duration-300 ease-in-out hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Get Started
          </Link>
          <Link
            to={"/events"}
            className="text-lg font-semibold text-black underline dark:text-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
