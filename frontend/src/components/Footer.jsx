function Footer() {
  return (
    <footer class="flex flex-col justify-center space-y-10 border-t border-gray-300 bg-black py-24 dark:border-gray-700 dark:text-white">
      <nav class="flex flex-wrap justify-center gap-6 font-medium text-gray-500">
        <a class="hover:text-white dark:hover:text-white" href="#">
          Home
        </a>
        <a class="hover:text-white" href="#">
          Event
        </a>
        <a class="hover:text-white" href="#">
          About
        </a>
        <a class="hover:text-white" href="#">
          Commuity
        </a>
        <a class="hover:text-white" href="#">
          Teams
        </a>
        <a class="hover:text-white" href="#">
          Contact
        </a>
      </nav>

      <div class="flex justify-center space-x-5">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://img.icons8.com/fluent/30/000000/linkedin-2.png" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
        </a>
        <a
          href="https://messenger.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://img.icons8.com/fluent/30/000000/facebook-messenger--v2.png" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="https://img.icons8.com/fluent/30/000000/twitter.png" />
        </a>
      </div>
      <p class="text-center font-medium text-gray-700">
        &copy; 2025 HandsOn Ltd. All rights reservered.
      </p>
    </footer>
  );
}

export default Footer;
