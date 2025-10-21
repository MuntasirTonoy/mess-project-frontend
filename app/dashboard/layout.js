// This component provides the structure (layout) specifically for the
// /dashboard/bills route segment.

/**
 * Dashboard Bills Layout Component
 * @param {object} props
 * @param {React.ReactNode} props.children - The page content from page.js
 */
export default function BillsLayout({ children }) {
  return (
    // This section applies any structural or padding elements specific
    // to the bills dashboard content.
    <section className="container mx-auto  px-4 py-8">
      {/* The children prop renders the content from 
        mess-project-frontend/app/dashboard/bills/page.js
      */}
      {children}
    </section>
  );
}
