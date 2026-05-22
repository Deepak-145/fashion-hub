export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Fashion Hub. All rights reserved.</p>
        <p>Designed By Ritu Sharma With support from Aadti & Diksha</p>
      </div>
    </footer>
  );
}
