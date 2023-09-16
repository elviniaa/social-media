import { Form, Segment, Image, Icon, Header } from "semantic-ui-react";
import { useRouter } from "next/router";

function ImageDropDiv({
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
  profilePicUrl,
}) {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = Array.from(e.dataTransfer.files);
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }}
          >
            {mediaPreview === null ? (
              <>
                <Segment placeholder basic>
                  {signupRoute ? (
                    <Header icon>
                      <Icon
                        name="file image outline"
                        style={{ cursor: "pointer" }}
                        onClick={() => inputRef.current.click()}
                      />
                      Drag & Drop or Click to Upload Image
                    </Header>
                  ) : (
                    <span style={{ textAlign: "center" }}>
                      <Image
                        src={profilePicUrl}
                        alt="Profile pic"
                        style={{ cursor: "pointer" }}
                        onClick={() => inputRef.current.click()}
                        size="huge"
                        centered
                      />
                      Drag & Drop or Click to Upload Image
                    </span>
                  )}
                </Segment>
              </>
            ) : (
              <>
                <Segment placeholder basic>
                  <Image
                    src={mediaPreview}
                    size="medium"
                    centered
                    style={{ cursor: "pointer" }}
                    onClick={() => inputRef.current.click()}
                  />
                </Segment>
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
}

export default ImageDropDiv;
