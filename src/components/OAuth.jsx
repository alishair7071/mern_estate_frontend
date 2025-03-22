import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {

    console.log("handleGoogleClick is called");
    dispatch(signInStart());


    try {
      console.log("enter the in try block");
      const Provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, Provider);
     // console.log(result);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
       console.log("passed api calling");
      const jsonData = await response.json();
     // console.log(jsonData.success);
      if (jsonData.success == false) {
        console.log("is going to call failure due to false success");
        dispatch(signInFailure(jsonData.message));
        return;
      }
      dispatch(signInSuccess(jsonData));
      navigate("/");
    } catch (e) {
      console.log("is going to call failure from catch");
      console.log("OAuth Error:  " + e.message);
      dispatch(signInFailure(e.message));
    }
  };

  return (
    <button
      onClick={() => handleGoogleClick()}
      type="button"
      className="text-center hover:opacity-90 text-white rounded-lg p-2 bg-red-700 uppercase"
    >
      {loading ? "loading..." : "continue with google"}
    </button>
  );
};

export default OAuth;
