import { useEffect, useState } from "react";
import { uploadImage } from "../utills/uploadImage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UpdateListing = () => {
  const API_BASE_URL = process.env.BACKEND_URL_DEPLOYED_VERCEL; 
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
 const navigate =  useNavigate();
 const params = useParams();
  const { currentUser } = useSelector((store) => store.user);
  const [loadingForServer, setLoadingForServer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    bathRooms: 1,
    bedRooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imagesUrls: [],
  });
  const [uploadImageError, setUploadImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(()=>{

    const fetchListing= async ()=>{
            const response= await fetch(`${API_BASE_URL}/listing/getListing/${params.id}`);

            const jsonData= await response.json();
            if(jsonData.success== false){
                console.log(jsonData.message);
                return;
            }
            setFormData(jsonData);
    }
    fetchListing();

  }, []);

  //upload images by calling a function 'uploadImage' that is in separate file
  const uploadImages = async (files) => {
    let imagesUrlsArrayFromSupabase = [];

    if (files.length > 0 && files.length < 7) {
      setIsLoading(true);
      for (let file of files) {
        const result = await uploadImage(file);
        if (result.error) {
          alert("Upload failed: " + result.error);
          setIsLoading(false);
          setUploadImageError(false);
        } else {
          imagesUrlsArrayFromSupabase.push(result.publicData.publicUrl);
        }
      }
      setFormData({
        ...formData,
        imagesUrls: formData.imagesUrls.concat(imagesUrlsArrayFromSupabase),
      });
      setUploadImageError(false);
      setIsLoading(false);
    } else {
      setUploadImageError(
        "You can only upload greater than 0 & less than 6 images at once"
      );
    }
  };

  //delete images from formData actually this function will delete image from formData,
  //not from supabase
  const deleteImage = (index) => {
    setFormData({
      ...formData,
      imagesUrls: formData.imagesUrls.filter((url, i) => i !== index),
    });
  };

  const handleTypingInInputs = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id == "parking" ||
      e.target.id == "offer" ||
      e.target.id == "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const submitFormToServer = async (e) => {
    e.preventDefault();

    if (formData.imagesUrls.length < 1)
      return setError("You have to upload at least 1 image");
    if (formData.regularPrice < formData.discountPrice)
      return setError("discount price must be less than regular price");

    try {
      setLoadingForServer(true);

      const response = await fetch(`${API_BASE_URL}/listing/updateListing/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      console.log(response);

      const jsonData = await response.json();

      if (jsonData.success == false) {
        setLoadingForServer(false);
        setError(jsonData.message);
        return;
      }
      setLoadingForServer(false);
      setError(null);
      navigate(`/listing/${jsonData._id}`);
      console.log("created successfully");
      
    } catch (e) {
      setLoadingForServer(false);
      setError(e.message);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-3">
      <h1 className="text-3xl font-semibold text-center my-6">
        Update the listing
      </h1>
      <form
        onSubmit={submitFormToServer}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="shadow-md bg-white p-2 rounded-lg"
            required
            id="name"
            onChange={handleTypingInInputs}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="shadow-md bg-white p-2 rounded-lg"
            required
            id="description"
            onChange={handleTypingInInputs}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="shadow-md bg-white p-2 rounded-lg"
            required
            id="address"
            onChange={handleTypingInInputs}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleTypingInInputs}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleTypingInInputs}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleTypingInInputs}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleTypingInInputs}
                checked={formData.furnsished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleTypingInInputs}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRooms"
                min={1}
                max={10}
                required
                className="shadow-md bg-white rounded-lg p-2"
                onChange={handleTypingInInputs}
                value={formData.bedRooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRooms"
                min={1}
                max={10}
                required
                className="shadow-md bg-white rounded-lg p-2"
                onChange={handleTypingInInputs}
                value={formData.bathRooms}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="shadow-md bg-white rounded-lg p-2 max-w-20"
                onChange={handleTypingInInputs}
                value={formData.regularPrice}
              />
              <div className="flex flex-col justify-center items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="shadow-md bg-white rounded-lg p-2 max-w-20"
                  onChange={handleTypingInInputs}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col justify-center items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <p className="font-semibold">
            Images
            <span className="font-normal ml-2">
              :The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-3">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              max={6}
              id="images"
              accept="image/*"
              multiple
              className="border border-gray-500 rounded-lg p-2 w-full"
            />

            <button
              onClick={() => uploadImages(files)}
              type="button"
              className="uppercase rounded
             p-3 text-green-500 border border-green-500 hover:shadow-xl"
            >
              {isLoading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-600">{uploadImageError && uploadImageError}</p>

          {formData.imagesUrls.length > 0 &&
            formData.imagesUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3"
              >
                <img src={url} alt="listing Images" className="w-20 h-20" />
                <button
                  onClick={() => deleteImage(index)}
                  type="button"
                  className="text-red-500 uppercase"
                >
                  delete
                </button>
              </div>
            ))}

          <button 
          disabled= {isLoading || loadingForServer }
            type="submit"
            className="uppercase bg-slate-700 text-white shadow-lg
             rounded-lg p-2 hover:cursor-pointer disabled:opacity-70"
          >
            {loadingForServer ? "updagting..." : "update listing"}
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
