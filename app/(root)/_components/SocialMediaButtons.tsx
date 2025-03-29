import { Link } from "@heroui/react";
import { BsInstagram } from "react-icons/bs";

const SocialMediaButtons = () => {
  return (
    <div className="space-x-1">
      <Link
        href="https://www.instagram.com/genacourtney/"
        target="_blank"
        // size="sm"
        // isIconOnly
        // radius="full"
        // variant="light"
        className="text-inherit align-middle rounded-full hover:bg-background-200"
      >
        <BsInstagram size={25} />
      </Link>
    </div>
  );
};

export default SocialMediaButtons;
