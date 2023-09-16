import { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Divider,
  Message,
  List,
  Checkbox,
} from "semantic-ui-react";
import { passwordUpdate, toggleMessagePopup } from "../../utils/profileActions";

function Settings({ newMessagePopup }) {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showMessageSettings, setShowMessageSettings] = useState(false);
  const [popupSetting, setPopupSetting] = useState(newMessagePopup);

  const isFirstRun = useRef(true);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
  }, [popupSetting]);

  return (
    <>
      {success && (
        <>
          <Message icon="check circle" header="Updated Successfully" success />
          <Divider hidden />
        </>
      )}

      <List size="huge" animated>
        <List.Item>
          <List.Icon name="user secret" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              as="a"
              onClick={() => setShowUpdatePassword(!showUpdatePassword)}
              content="Update Password"
            />
          </List.Content>
          {showUpdatePassword && (
            <UpdatePassword
              setSuccess={setSuccess}
              setShowUpdatePassword={setShowUpdatePassword}
            />
          )}
        </List.Item>

        <Divider />

        <List.Item>
          <List.Icon
            name="paper plane outline"
            size="large"
            verticalAlign="middle"
          />

          <List.Content>
            <List.Header
              onClick={() => setShowMessageSettings(!showMessageSettings)}
              as="a"
              content="Show New Message Popup?"
            />
          </List.Content>

          {showMessageSettings && (
            <div style={{ marginTop: "10px" }}>
              Control whether a Popup should appear when there is a new Message?
              <br />
              <br />
              <Checkbox
                checked={popupSetting}
                toggle
                onChange={() =>
                  toggleMessagePopup(popupSetting, setPopupSetting, setSuccess)
                }
              />
            </div>
          )}
        </List.Item>
      </List>
    </>
  );
}

const UpdatePassword = ({ setSuccess, setShowUpdatePassword }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userPasswords, setUserPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { currentPassword, newPassword } = userPasswords;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserPasswords((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Form
        error={errorMsg != null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault;
          setLoading(true);

          await passwordUpdate(setSuccess, userPasswords);
          setLoading(false);

          setShowUpdatePassword(false);
        }}
      >
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              type="password"
              label="Current Password"
              placeholder="Enter Current Password"
              name="currentPassword"
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              type="password"
              label="New Password"
              placeholder="Enter New Password"
              name="newPassword"
              onChange={handleChange}
              value={newPassword}
            />

            <Button
              disabled={loading || newPassword === "" || currentPassword === ""}
              compact
              icon="configure"
              type="submit"
              content="Confirm"
            />

            <Button
              disabled={loading}
              compact
              icon="cancel"
              content="Cancel"
              onClick={() => setShowUpdatePassword(false)}
            />

            <Message error icon="meh" header="Oops" content={errorMsg} />
          </List.Item>
        </List.List>
      </Form>

      <Divider hidden />
    </>
  );
};

export default Settings;
