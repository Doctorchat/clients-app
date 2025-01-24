import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function PhysicalAppointmentsPage() {
  const user = useSelector((store) => store.user.data);
  const { t } = useTranslation();

  return (
    <div id="physical-appointment-container" className="tw-relative tw-bg-white sidebar-body">
      <div className="scrollable scrollable-y">
        <div className="tw-sticky tw-top-0 tw-bg-white tw-h-12 tw-border-b tw-flex tw-items-center tw-px-5 tw-z-50">
          <Link href="/home" className="tw-flex tw-gap-2 tw-opacity-80 tw-items-center">
            <ArrowLeft size={20} />
            {t("back")}
          </Link>
        </div>

        <div className="tw-p-5">
          <div className="tw-grid xl:tw-grid-cols-2">
            <div className="tw-p-3 tw-rounded-xl tw-border">
              <div className="tw-flex tw-gap-2">
                <Avatar
                  size={72}
                  shape="square"
                  className="tw-rounded-lg tw-flex-none"
                  src="/images/default-logo-medical-centre.jpg"
                />
                <div>
                  <div className="tw-font-medium">Name medical centre</div>
                  <div className="tw-opacity-80 tw-text-sm">str. address, City</div>
                  <a href={`tel:${"123"}`} className="tw-font-medium tw-text-sm tw-text-primary">
                    060 698 148
                  </a>
                </div>
              </div>

              <div className="tw-border-t mt-3 pt-3">
                <div>Data: 26 ianuarie, 14:00</div>
                <div>Medic: Demo Doctor</div>
              </div>
            </div>
          </div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab ad asperiores aut cumque dicta, doloremque eius
          eos expedita explicabo fugit illo iste labore laborum mollitia natus necessitatibus nemo nihil numquam
          praesentium provident quibusdam quisquam repellat reprehenderit sint tempore temporibus totam veritatis
          voluptas voluptatum! Aspernatur at autem, beatae blanditiis cum delectus, deleniti doloremque excepturi
          facilis fuga fugit illo impedit ipsum laboriosam maiores maxime, molestiae molestias nihil officia optio
          provident quae quaerat quidem rem repellendus similique suscipit tempore ullam unde vitae voluptas voluptate
          voluptatem voluptatibus. Accusamus deserunt dolores ea earum, facilis ipsum, iusto maiores minus quaerat quam
          saepe temporibus unde ut veniam voluptates! Accusantium consequatur deserunt distinctio ducimus, enim est iure
          nam numquam sequi soluta vel voluptate? Ad alias aliquid animi beatae consectetur cupiditate delectus deserunt
          doloribus error est eveniet explicabo facilis fugiat harum hic ipsa ipsum iste iure laborum maxime non nostrum
          odit, perspiciatis quae repellendus sit temporibus, ut velit veniam voluptatum? Culpa nesciunt nihil ratione
          rem totam veniam voluptates? Accusamus aliquam architecto deserunt inventore modi mollitia quaerat quia quis
          sapiente voluptas? Assumenda debitis dicta molestias nemo porro quo recusandae. Architecto aut blanditiis
          consectetur consequuntur dicta distinctio dolor doloremque est eum itaque, laboriosam modi nam nostrum
          repellendus soluta unde voluptate? Ab aperiam asperiores beatae commodi consectetur consequuntur corporis
          culpa cumque dolor dolores ea, enim excepturi incidunt ipsa itaque magni minus molestiae nam necessitatibus
          numquam odit quae quaerat quam qui quidem reprehenderit rerum saepe sapiente sequi suscipit totam, vitae
          voluptas voluptatem? Amet aspernatur debitis, dolores earum inventore, labore laborum nesciunt non odio quam
          quo sunt unde vitae. Debitis dicta, labore? Aliquid animi at eos nisi praesentium quaerat repudiandae rerum
          ullam? Ab, asperiores aut corporis cupiditate dicta eos excepturi fugiat, id illo itaque laborum laudantium
          quae quia quod repellendus, tempore unde voluptatem! A aperiam aspernatur atque consectetur delectus deserunt
          dignissimos doloremque ea eaque earum expedita explicabo impedit ipsum iste laboriosam laborum magnam maiores
          maxime minus nesciunt nisi nobis repellendus sit vel velit, vero voluptates. Blanditiis culpa delectus ea
          error harum in ipsa ipsum, itaque iure nesciunt nisi nostrum odio possimus qui quos repellat sit soluta vitae
          voluptates voluptatibus? A accusantium amet architecto aspernatur blanditiis commodi cum deserunt earum enim
          eos eum facilis fugiat fugit harum hic ipsam itaque iusto labore laborum laudantium nisi nobis odit, omnis
          pariatur perferendis provident quae quis quisquam quo quos recusandae reprehenderit sed sequi tempora ullam
          velit vitae. Iusto laborum ratione sed sint voluptatibus! Assumenda at consequuntur debitis facere ipsum optio
          possimus, praesentium quas quidem suscipit. A accusantium ad architecto ducimus eum, ex fuga minima
          necessitatibus perspiciatis, quisquam quos rerum? Accusantium aliquam dolor labore maiores mollitia non quod
          rerum veritatis! Accusantium animi asperiores blanditiis cum cupiditate dignissimos ducimus eligendi eum fuga
          hic id ipsum, magni natus neque numquam odio praesentium quas quidem quis recusandae repellendus reprehenderit
          repudiandae sint sunt suscipit tempora ullam unde ut voluptates voluptatum! Aut blanditiis consequuntur eum
          impedit, iusto magni nostrum odio quibusdam quidem quod, repellat similique ut voluptatibus. Ab atque debitis
          dicta dolore et itaque labore laborum optio saepe veritatis! Incidunt neque nobis optio quae, quibusdam
          repellat totam. Corporis dicta esse maxime mollitia provident. Distinctio eum eveniet ex iure libero minima
          nisi, qui quibusdam quidem quos repellendus ullam? Dolore facilis in mollitia odit officia omnis possimus quas
          quasi quidem, sed sit suscipit vero voluptates? Adipisci amet architecto atque blanditiis corporis dignissimos
          facilis fugit, ipsum magnam quam quasi quia rerum sapiente sequi similique sunt ut voluptatum. A aperiam
          doloribus enim fuga illum impedit incidunt inventore, ipsum labore minima minus nesciunt nihil non officiis
          possimus, provident rerum, voluptatum. Architecto aspernatur aut deserunt eos maxime numquam similique sunt
          voluptas. Deserunt dignissimos distinctio eius est, expedita iste iusto necessitatibus neque obcaecati
          quisquam, quo rerum similique suscipit ut vel? At autem dolorum excepturi facilis fugiat, harum laudantium
          nihil recusandae. Fuga libero neque nostrum nulla quis recusandae sint tempora ullam veniam voluptatum!
          Architecto at corporis harum, illum impedit inventore nobis nulla optio quae quia soluta voluptatum! A amet
          atque aut, autem cum doloribus earum eius exercitationem inventore nisi nulla numquam quasi veniam? Accusamus
          accusantium amet aperiam atque blanditiis consequuntur doloribus eligendi est et exercitationem facilis harum
          illum in incidunt, inventore ipsam labore laborum laudantium libero maxime molestiae, molestias nisi numquam
          officia omnis perspiciatis placeat quaerat qui quia quisquam recusandae rem sapiente sed suscipit totam vero
          voluptate. Animi eius, id inventore labore libero molestias repellendus repudiandae saepe! Consectetur
          corporis cum debitis distinctio ea eos in, mollitia nam natus, nihil odit officia, qui vel? Ad amet aspernatur
          at aut consequatur corporis cum cumque deleniti distinctio doloribus ducimus fugit illo iure labore maxime
          minima modi molestias mollitia natus nesciunt omnis praesentium provident quibusdam quidem rerum tempora
          totam, voluptates. Aliquam commodi cumque cupiditate dicta dolore earum enim est explicabo in itaque iusto
          laboriosam laudantium magni minima molestiae mollitia necessitatibus nostrum odio officia officiis omnis optio
          perspiciatis placeat quam, quo ratione sapiente sit tenetur ullam velit veniam, vero voluptas voluptatem?
          Adipisci architecto corporis dignissimos dolor doloribus ducimus esse et eveniet excepturi facilis, iste magni
          minus nihil omnis quod unde veritatis. A accusantium amet exercitationem veritatis! Adipisci ducimus error
          fuga iste itaque nostrum pariatur reiciendis tempora? Accusamus cum exercitationem facere fugit, maiores nulla
          porro quas quidem saepe sequi, sit sunt. Beatae debitis distinctio earum eos esse expedita facilis, fugiat
          inventore ipsum laudantium magni minus molestiae molestias natus odio quam quasi quia rerum similique tempore
          ut veritatis voluptate voluptatem? Ad at distinctio dolorem dolores enim et, facilis fugit illo illum iste
          itaque iure iusto minima neque quidem totam vitae! A commodi doloribus in inventore natus ratione sunt! Ad
          architecto aut, distinctio dolorem doloremque inventore libero non sunt vero voluptas? Aut dolorum eaque eos
          eveniet fugit itaque magnam minima minus molestiae neque nulla optio porro praesentium quae quo, quos sint sit
          tenetur vitae voluptas! Ad aut omnis vero. Corporis cum ea hic itaque nulla placeat unde veritatis. Eos illo
          ipsam voluptate! Accusantium aut dolore earum ex maxime necessitatibus sit suscipit tempora? Adipisci,
          architecto asperiores dolores excepturi fugiat harum illum incidunt libero mollitia nesciunt nihil nostrum,
          placeat praesentium provident quod ratione, sequi similique voluptate! Deserunt illo nesciunt sint!
        </div>
      </div>
    </div>
    /*<div className="select-chat">
      <div className="p-4" style={{ maxWidth: 540 }}>
        <AuthRoleWrapper extraValidation={user?.status === false} roles={[userRoles.get("doctor")]}>
          <Alert
            type="warn"
            message={
              <>
                <strong>{t("feedback_form.warn_title")}</strong> <br />
                {t("feedback_form.warn_subtitle")}
              </>
            }
          />
        </AuthRoleWrapper>
      </div>
    </div>*/
  );
}

export default PhysicalAppointmentsPage;
