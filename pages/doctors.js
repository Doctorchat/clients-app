import DocList from "@/components/DocList";
import api from "@/services/axios/api";

export default function Doctors({ doctors }) {
  return (
    <div className="external-doc-list">
      <DocList onDocClick={() => null} data={[]} />
    </div>
  );
}

export async function getStaticProps() {
  const res = await api.docList.get();

  return {
    props: {
      doctors: res.data,
    },
  };
}
