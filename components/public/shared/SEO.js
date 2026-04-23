// components/public/shared/SEO.js
export default function SEO({ title, description }) {
  const fullTitle = `${title} | Tân Ngọc Lực - Thép Xây Dựng Tây Ninh`;
  const defaultDesc = "Công ty TNHH Tân Ngọc Lực chuyên cung cấp thép xây dựng, thép hình, thép tấm uy tín tại Tây Ninh.";

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}