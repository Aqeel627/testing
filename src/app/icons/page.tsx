"use client";
import { getIconNames } from "@/lib/utils";
import IconGallery from "@/components/pages/icon-gallery";
import Header from "@/components/common/header";
import { useCacheStore } from "@/lib/store/cacheStore";
import LoginModal from "@/components/modal/login";
import ChangePassword from "@/components/modal/change-password";

const IconsRoute = () => {
  const names = getIconNames();
  const { loginModal, isPasswordModalOpen } = useCacheStore();
  return (
    <>
      <div className="w-full h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-50">
          {/* <Marque /> */}
          <Header />
        </div>
        <div className="h-full pt-[50px] overflow-y-auto no-scrollbar pb-[30px] ps-3 pe-[6px]">
          <div className="@container w-full">
            <IconGallery names={names} />
          </div>
        </div>
      </div>
      {loginModal && <LoginModal />}
      {isPasswordModalOpen && <ChangePassword />}
    </>
  );
};

export default IconsRoute;
