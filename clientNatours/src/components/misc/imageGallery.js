import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";


export default function ImageGallery({ photos }) {
  // console.log("photos in ImageGallery => ", photos);
  // state
  // react-image
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // // hooks
  const params = useParams();

  const openLightbox = useCallback((event, {photo, index}) => {
    setCurrent(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrent(0);
    setIsOpen(false);
  };

  return (
    <>
      <Gallery photos={photos} onClick={openLightbox} />;

      <ModalGateway>
        {isOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel currentIndex={current} views={photos.map((x)=>({
              ...x,
              srcset: x.srcSet,
              caption: x.title,

            }))} />
          </Modal>
        ) : null}
      </ModalGateway>
    </>
  );
}