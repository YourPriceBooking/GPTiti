import Link from "next/link";
import PageNav from "@/components/common/PageNav";
import css from "./SharedLayoutMarketing.module.css";

type SharedLayoutMarketingProps = {
  children: React.ReactNode;
};

export default function SharedLayoutMarketing({
  children,
}: SharedLayoutMarketingProps) {
  return (
    <div className={css.shell}>
      <PageNav />
      <main className={css.container}>{children}</main>
      <footer className={css.footer}>
        <nav className={css.footerNav}>
          <Link href="/" className={css.footerLink}>
            Home
          </Link>
          <Link href="/our-mission" className={css.footerLink}>
            Our Mission
          </Link>
          <Link href="/terms-conditions" className={css.footerLink}>
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy-policy" className={css.footerLink}>
            Privacy Policy
          </Link>
          <Link href="/sign-in" className={css.footerLink}>
            Sign in
          </Link>
          <Link href="/trust" className={css.footerLink}>
            Trust &amp; Safety
          </Link>
          <Link href="/ai-models-guide" className={css.footerLink}>
            AI Models Guide
          </Link>
        </nav>
        <p className={css.copyright}>
          © {new Date().getFullYear()} Your Price Booking OÜ. All rights
          reserved. GPTiti™ is a trademark of Your Price Booking OÜ.
        </p>
      </footer>
    </div>
  );
}
