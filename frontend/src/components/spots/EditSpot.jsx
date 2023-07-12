import React, { useState, useRef, useEffect } from "react";
import { CreateSpotWrapper } from "./CreateSpotWrapper";
import { VALID_STATES } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTrash,
  faSpinner,
  faXmarkCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  thunkPostSpotImages,
  thunkGetSpotDetails,
  deleteSpotImages,
  thunkEditSpot,
  thunkEditSpotImage,
} from "../../store/singleSpot";
import { useDispatch } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

export default function EditSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const [images, setImages] = useState([]);
  const [previewImg, setPreviewImg] = useState(0);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spotData, setSpotData] = useState({
    address: "",
    city: "",
    country: "USA",
    state: "CA",
    price: 1,
    description: "",
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({
    address: false,
    city: false,
    country: false,
    state: false,
    price: false,
    description: false,
    name: false,
    images: false,
  });
  const imgUploadRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await dispatch(thunkGetSpotDetails(spotId));
      setSpotData({
        address: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        price: data.price,
        description: data.description,
        name: data.name,
        avgRating: data.avgStarRating || 0,
      });
      setImages(data.SpotImages.sort((a, b) => b.preview - a.preview));
    })();
  }, [dispatch]);

  const handleSubmit = async () => {
    setFormTouched({
      address: true,
      city: true,
      country: true,
      state: true,
      price: true,
      description: true,
      name: true,
      images: true,
    });
    if (!Object.keys(formErrors).length) {
      setLoading(true);
      if (imagesToDelete.length) {
        const deletedImgs = await deleteSpotImages(imagesToDelete);
      }
      const editedSpot = await dispatch(
        thunkEditSpot({ ...spotData, id: spotId })
      );
      //if new images are being uploaded
      if (images.length) {
        //previewInd
        if (images[previewImg]?.url) {
          //image is already preview in db
          if (images[previewImg].preview === false) {
            //image is in db but is not preview, need to make it the preview image
            await dispatch(thunkEditSpotImage(images[previewImg].id, spotId));
          }
          if (images.filter((img) => !img.url).length) {
            await dispatch(
              thunkPostSpotImages(
                spotId,
                images.filter((img) => !img.url),
                -1
              )
            );
          }
        } else {
          //image needs to be marked preview
          const imagesInDb = images.filter((img) => img.url);
          let newPreviewInd = previewImg - imagesInDb.length;
          await dispatch(
            thunkPostSpotImages(
              spotId,
              images.filter((img) => !img.url),
              newPreviewInd
            )
          );
        }
      }

      //   const newSpotId = await dispatch(thunkCreateSpot(spotData));
      //   const posted = await dispatch(thunkPostSpotImages(newSpotId, images));
      //   console.log(posted);
      history.push(`/spots/${spotId}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    const errors = {};
    if (!spotData.address.match(/^\d+\s[A-z]+\s[A-z]+/g)) {
      errors.address = "Please enter a valid address";
    }
    if (spotData.city.length < 3) {
      errors.city = "city must be at least 3 characters";
    }
    if (spotData.city.length > 30) {
      errors.city = "city must be fewer than 30 characters";
    }
    if (spotData.price < 1) {
      errors.price = "price must be greater than 0";
    }
    if (spotData.description.length < 20) {
      errors.description = "description must be at least 20 characters";
    }
    if (spotData.name.length < 2) {
      errors.name = "title must be at least 2 characters long";
    }
    if (images.length < 2) {
      errors.images = "Please upload at least 2 images";
    }

    setFormErrors(errors);
  }, [spotData, images]);

  return (
    <CreateSpotWrapper>
      <form
        onChange={(e) => {
          setFormTouched({ ...formTouched, [e.target.id]: true });
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1>Create a new Spot</h1>
        <h2>Where is your spot located?</h2>
        <div className='form-group group-1'>
          <div className='sub-group address'>
            <label htmlFor=''>Street address</label>
            {formErrors?.address && formTouched.address && (
              <p className='error'>{formErrors.address}</p>
            )}
            <input
              id='address'
              type='text'
              placeholder='Address'
              onChange={(e) =>
                setSpotData({ ...spotData, address: e.target.value })
              }
              value={spotData.address}
            />
          </div>
          <div className='sub-group country'>
            <label htmlFor=''>Country</label>
            <select
              name='country'
              id='country'
              defaultValue={"USA"}
              onChange={(e) =>
                setSpotData({ ...spotData, country: e.target.value })
              }
              value={spotData.country}
            >
              <option value={"USA"}>USA</option>
            </select>
          </div>
        </div>
        <div className='form-group group-2'>
          <div className='sub-group city'>
            <label htmlFor=''>City</label>
            {formErrors?.city && formTouched.city && (
              <p className='error'>{formErrors.city}</p>
            )}
            <input
              id='city'
              type='text'
              placeholder='City'
              onChange={(e) =>
                setSpotData({ ...spotData, city: e.target.value })
              }
              value={spotData.city}
            />
          </div>
          <div className='sub-group state'>
            <label htmlFor=''>State</label>
            <select
              name='state'
              id='state'
              defaultValue={"CA"}
              onChange={(e) =>
                setSpotData({ ...spotData, state: e.target.value })
              }
              value={spotData.state}
            >
              {VALID_STATES.map((s) => (
                <option value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood
        </p>
        {formErrors?.description && formTouched.description && (
          <p className='error'>{formErrors.description}</p>
        )}
        <div className='form-group group-5'>
          <textarea
            style={{ resize: "none" }}
            name='description'
            id='description'
            cols='30'
            rows='10'
            onChange={(e) =>
              setSpotData({ ...spotData, description: e.target.value })
            }
            value={spotData.description}
          ></textarea>
        </div>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special
        </p>
        {formErrors?.name && formTouched.name && (
          <p className='error'>{formErrors.name}</p>
        )}
        <div className='form-group'>
          <input
            id='name'
            type='text'
            placeholder='Spot Title'
            onChange={(e) => setSpotData({ ...spotData, name: e.target.value })}
            value={spotData.name}
          />
        </div>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results
        </p>
        {formErrors?.price && formTouched.price && (
          <p className='error'>{formErrors.price}</p>
        )}
        <div className='form-group'>
          $
          <input
            step='.01'
            id='price'
            type='number'
            min={1}
            onChange={(e) =>
              setSpotData({ ...spotData, price: +e.target.value })
            }
            defaultValue={1}
          />
        </div>
        <h2>Upload Photos</h2>
        <p>Click the photo to mark as preview</p>
        <p>(5 max photo upload 2MB)</p>
        {formErrors?.images && <p className='error'>{formErrors.images}</p>}
        <div className='image-container'>
          {images.map((image, i) => (
            <div
              className={`image-preview ${previewImg === i && "preview-img"}`}
              onClick={() => {
                setPreviewImg(i);
              }}
            >
              <img
                src={image.url || URL.createObjectURL(image)}
                alt='preview image'
              />
              <FontAwesomeIcon
                icon={faXmarkCircle}
                color='white'
                onClick={() => {
                  if (image.url) {
                    //image already exists in db.. needs to be deleted
                    setImagesToDelete([...imagesToDelete, image.id]);
                  }
                  setImages(images.filter((img, ind) => ind !== i));
                }}
              />
            </div>
          ))}
          <div
            id='images'
            className='upload-btn'
            onClick={() => {
              imgUploadRef.current.click();
            }}
          >
            <FontAwesomeIcon icon={faUpload} />
            <p>Upload Image</p>
            <input
              type='file'
              className='file-input'
              ref={imgUploadRef}
              onClick={(e) => {
                if (images.length >= 5) e.preventDefault();
              }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  const file = e.target.files[0];
                  if (file.type.substring("image/") && images.length < 5) {
                    setImages([...images, file]);
                  }
                }
              }}
            />
          </div>
        </div>
        <button disabled={loading} type='submit'>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className='spinner' />
          ) : (
            "Edit spot"
          )}
        </button>
      </form>
    </CreateSpotWrapper>
  );
}
