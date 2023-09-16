import { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Message,
  Segment,
  Divider,
  Popup,
} from "semantic-ui-react";
import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
let cancel;
import { registerUser } from "../utils/authUser";
import uploadPic from "../utils/uploadPicToCloudinary";
import PasswordStrengthBar from "react-password-strength-bar";

function signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });

  const { name, email, password } = user;

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const inputRef = useRef();

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const isUser = Object.values({ name, email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const checkUsername = async (value = "") => {
    setUsernameLoading(true);

    try {
      //cancelToken -> when request is pending
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (errorMsg !== null) setErrorMsg(null);

      if (res.data === "Available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      setErrorMsg("Username not available");
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === null ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  const handlePasswordStrength = (password) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = password.length >= 6 ? 1 : 0;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(password);
    strengthChecks.hasLowerCase = /[a-z]+/.test(password);
    strengthChecks.hasDigit = /[0-9]+/.test(password);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(password);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length === 5
        ? "Very Strong"
        : verifiedList.length === 4
        ? "Strong"
        : verifiedList.length === 3
        ? "Good"
        : verifiedList.length === 2
        ? "Fair"
        : "Weak";

    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg("Error Uploading Image");
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  };

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />

        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            handleChange={handleChange}
          />

          <Form.Input
            required
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
          />

          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
          />

          <Popup
            trigger={
              <Form.Input
                label="Password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                type="password"
                required
              />
            }
            header="Password Requirement"
            content="Password must contain at least 6 characters, including upper/lowercase, digits, and special characters."
            on="focus"
          />

          <PasswordStrengthBar
            password={password}
            onChangeScore={handlePasswordStrength}
            minLength={6}
            scoreWords={["Weak", "Fair", "Good", "Strong", "Very Strong"]}
          />

          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            required
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
          />

          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="green"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
}

export default signup;
