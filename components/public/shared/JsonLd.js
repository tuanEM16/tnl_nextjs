// components/public/shared/JsonLd.js
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Mẹo: Đại ca sẽ dùng cái này cho "LocalBusiness" (Tân Ngọc Lực) hoặc "Product" (Thép tấm, Thép hình...)