import Link from "next/link";

import Image from "next/image";

import { Navbar, Container } from "react-bootstrap";
const Appbar = () => {
  return (
    <Navbar expand="lg" bg="light">
      <Container className="w-100">
        <Navbar.Brand>
          <Link href="/">
            <a>
              <Image
                src="/brand-logo-b.svg"
                alt="미남이시네요 로고"
                width="166"
                height="44"
              />
            </a>
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Appbar;
