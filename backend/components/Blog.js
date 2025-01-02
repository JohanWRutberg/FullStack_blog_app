import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  blogcategory: existingBlogcategory,
  description: existingDescription,
  tags: existingTags,
  status: existingStatus
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [blogcategory, setBlogcategory] = useState(existingBlogcategory || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [tags, setTags] = useState(existingTags || "");
  const [status, setStatus] = useState(existingStatus || "");

  async function createProduct(ev) {
    ev.preventDefault();

    const data = { title, slug, description, blogcategory, tags, status };

    if (_id) {
      await axios.put("/api/blogapi", { ...data, _id });
    } else {
      await axios.post("/api/blogapi", data);
    }

    setRedirect(true);
  }

  if (redirect) {
    router.push("/");
    return null;
  }

  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;
    const newSlug = inputValue.replace(/\s+/g, "-");
    setSlug(newSlug);
  };

  const sanitizedDescription = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ["a", "button", "span"],
    ALLOWED_ATTR: ["href", "class"]
  });

  return (
    <>
      <form onSubmit={createProduct} className="addWebsiteform">
        {/* Blog title */}
        <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
          />
        </div>

        {/* Blog slug */}
        <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
          <label htmlFor="slug">Slug</label>
          <input type="text" id="slug" value={slug} onChange={handleSlugChange} placeholder="Enter Slug url" required />
        </div>

        {/* Blog category */}
        <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
          <label htmlFor="category">Kategori</label>
          <select
            name="category"
            id="category"
            value={blogcategory}
            onChange={(e) => setBlogcategory(Array.from(e.target.selectedOptions, (option) => option.value))}
            multiple
          >
            <option value="drumsets">Drum sets</option>
            <option value="accessories">Accessories</option>
            <option value="sound">Sound</option>
            <option value="hot">Hot topics</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            Selected:{" "}
            {Array.isArray(existingBlogcategory) &&
              existingBlogcategory.map((category) => <span key={category}>{category}</span>)}
          </p>
        </div>

        {/* Markdown description content */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">Blogg Innehåll</label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "800px" }} // Adjust the height as needed
            renderHTML={(text) => {
              // Pass the sanitized content to ReactMarkdown
              const sanitizedText = DOMPurify.sanitize(text, {
                ALLOWED_TAGS: ["a", "button", "span"],
                ALLOWED_ATTR: ["href", "class"]
              });

              return (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]} // Allow raw HTML
                  children={sanitizedText} // Pass sanitized HTML content
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} className="custom-button" /> // Apply your button styles
                    ),
                    button: ({ node, ...props }) => <button {...props} className="custom-button" />,
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      if (inline) {
                        return <code>{children}</code>;
                      } else if (match) {
                        return (
                          <div style={{ position: "relative" }}>
                            <pre
                              style={{
                                padding: "0",
                                borderRadius: "5px",
                                overflowX: "auto",
                                whiteSpace: "pre-wrap"
                              }}
                              {...props}
                            >
                              <code>{children}</code>
                            </pre>
                            <button
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                zIndex: "1"
                              }}
                              onClick={() => navigator.clipboard.writeText(children)}
                            >
                              Copy code
                            </button>
                          </div>
                        );
                      } else {
                        return <code {...props}>{children}</code>;
                      }
                    }
                  }}
                />
              );
            }}
          />
        </div>

        {/* Tags */}
        <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
          <label htmlFor="tags">Taggar</label>
          <select
            name="tags"
            id="tags"
            value={tags}
            onChange={(e) => setTags(Array.from(e.target.selectedOptions, (option) => option.value))}
            multiple
          >
            <option value="audio">#Audio</option>
            <option value="beat">#Beat</option>
            <option value="comparison">#Comparison</option>
            <option value="controller">#Controller</option>
            <option value="cymbals">#Cymbals</option>
            <option value="drumkit">#Drumkit</option>
            <option value="drums">#Drums</option>
            <option value="drumsticks">#Drumsticks</option>
            <option value="edrums">#Edrums</option>
            <option value="electronic">#Electronic</option>
            <option value="hardware">#Hardware</option>
            <option value="kids">#Kids</option>
            <option value="kits">#Kits</option>
            <option value="pads">#Pads</option>
            <option value="practice">#Practice</option>
            <option value="rhythm">#Rhythm</option>
            <option value="sets">#Sets</option>
            <option value="sound">#Sound</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            Vald:{" "}
            {Array.isArray(existingTags) && existingTags.map((category) => <span key={category}>{category}</span>)}
          </p>
        </div>

        {/* Status */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} id="status">
            <option value="">Ingen vald</option>
            <option value="draft">Utkast</option>
            <option value="publish">Publicera</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            Vald: <span>{existingStatus}</span>
          </p>
        </div>

        {/* Save button */}
        <div className="w-100 mb-2">
          <button type="submit" className="w-100 addwebbtn flex flex-center">
            SPARA BLOGG
          </button>
        </div>
      </form>
    </>
  );
}
