import { Metadata } from "next";

type Props = {
  params: {
    title: string;
    description: string;
    image: string;
    twitterDescription: string;
    twitterCard: "summary";
    twitterTitle: string;
    twitterImage: string;
  };
};

export async function generateMetadata({
  params: {
    description,
    image,
    title,
    twitterCard,
    twitterDescription,
    twitterImage,
    twitterTitle,
  },
}: Props): Promise<Metadata> {
  return {
    title,
    description,
    openGraph: {
      title,
      images: image,
    },
    twitter: {
      images: twitterImage,
      title: twitterTitle,
      description: twitterDescription,
      card: twitterCard,
    },
  };
}
