// src/components/CustomHelmet.tsx
import { Helmet } from "react-helmet-async";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

const OG_IMAGE = `${SUPABASE_STORAGE_URL}/asset/open_graph.png`;

interface CustomHelmetProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  type: "website" | "article";
}

const CustomHelmet: React.FC<CustomHelmetProps> = ({ title, description, keywords, url, type }) => {
  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph 태그 */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="보돌코스코어드" />

      {/* 추가 CustomHelmet 태그 */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="보돌코스코어드" />
      <link rel="canonical" href={url} />

      {/* 구조화된 데이터 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Website",
          name: "보돌코스코어드",
          url: "https://bdks.vercel.app/",
          logo: OG_IMAGE,
        })}
      </script>
    </Helmet>
  );
};

export default CustomHelmet;
