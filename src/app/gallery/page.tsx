"use client";

import "react-image-gallery/styles/css/image-gallery.css";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ReactImageGallery from "react-image-gallery";
import { useAtomValue } from "jotai";
import { entityMapAtom } from "@/atoms";
import { Spinner } from "@/components/common/Spinner";
import Button from "@/components/common/Button/Button";
import { type EntityData, SubFolderName } from "@/types";

const GalleryPage = () => {
  const entityMap = useAtomValue(entityMapAtom);

  const [currentEntity, setCurrentEntity] = useState<EntityData | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!entityMap) {
    return;
  }

  const openModal = (entity: EntityData) => {
    setCurrentEntity(entity);
    setIsLoading(true);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentEntity(undefined);
  };

  const getGalleryImages = () =>
    currentEntity
      ? [
          ...Object.values(currentEntity[SubFolderName.PORTRAIT] || {}).flat(),
          ...Object.values(currentEntity[SubFolderName.MINI] || {}).flat(),
        ].map((image) => ({
          original: image,
          thumbnail: image,
        }))
      : [];

  const renderModal = () =>
    isOpen && (
      <div className="modal modal--visible">
        <div className="modal-content">
          <div className="modal-header u-flex u-center u-justify-space-between">
            <h5 className="modal-title mb-0">Images</h5>
            <Button className="btn btn-transparent" onClick={closeModal}>
              <FaTimes size={16} className="u-center" />
            </Button>
          </div>
          <div className="modal-body max-h-none">
            {isLoading && <Spinner />}
            <ReactImageGallery
              items={getGalleryImages()}
              showFullscreenButton
              showPlayButton={false}
              onImageLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
        <div className="modal-overlay" onClick={closeModal} />
      </div>
    );

  return (
    <div className="container mt-10">
      <h1 className="text-center mb-10">Gallery</h1>
      <ul className="row justify-center">
        {Object.entries(entityMap).map(([entityKey, entity]) => (
          <li
            className="ml-5 cursor-pointer"
            key={entityKey}
            onClick={() => openModal(entity.data)}
          >
            {entityKey}
          </li>
        ))}
      </ul>
      {renderModal()}
    </div>
  );
};

export default GalleryPage;
