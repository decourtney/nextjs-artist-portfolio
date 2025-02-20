import { Button, Link } from '@heroui/react';
import React from 'react'
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

const SocialMediaButtons = () => {
  return (
    <div className="space-x-1">
      <Button
        as={Link}
        href="https://www.instagram.com/genacourtney/"
        target="_blank"
        size="sm"
        isIconOnly
        radius="full"
        variant="light"
        className="text-primary"
      >
        <BsInstagram size={20} />
      </Button>
      <Button
        as={Link}
        href="https://twitter.com/yourusername"
        target="_blank"
        size="sm"
        isIconOnly
        radius="full"
        variant="light"
        className="text-primary"
      >
        <BsTwitter size={20} />
      </Button>
      <Button
        as={Link}
        href="https://facebook.com/yourusername"
        target="_blank"
        size="sm"
        isIconOnly
        radius="full"
        variant="light"
        className="text-primary"
      >
        <BsFacebook size={20} />
      </Button>
      <Button
        as={Link}
        href="https://linkedin.com/in/yourusername"
        target="_blank"
        size="sm"
        isIconOnly
        radius="full"
        variant="light"
        className="text-primary"
      >
        <BsLinkedin size={20} />
      </Button>
    </div>
  );
}

export default SocialMediaButtons
