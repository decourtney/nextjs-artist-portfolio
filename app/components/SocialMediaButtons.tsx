import { Button, Link } from '@heroui/react';
import { BsInstagram } from 'react-icons/bs';

const SocialMediaButtons = () => {
  return (
    <div className="space-x-1">
      <Button
        as={Link}
        href="https://www.instagram.com/genacourtney/"
        target="_blank"
        size="lg"
        isIconOnly
        radius="full"
        variant="light"
        className=" text-foreground-400"
      >
        <BsInstagram size={40} />
      </Button>
      {/* <Button
        as={Link}
        href="/"
        target="_blank"
        size="lg"
        isIconOnly
        radius="full"
        variant="light"
        className=" text-foreground-900"
      >
        <BsTwitter size={40} />
      </Button>
      <Button
        as={Link}
        href="/"
        target="_blank"
        size="lg"
        isIconOnly
        radius="full"
        variant="light"
        className=" text-foreground-900"
      >
        <BsFacebook size={40} />
      </Button>
      <Button
        as={Link}
        href="/"
        target="_blank"
        size="lg"
        isIconOnly
        radius="full"
        variant="light"
        className=" text-foreground-900"
      >
        <BsLinkedin size={40} />
      </Button> */}
    </div>
  );
}

export default SocialMediaButtons
