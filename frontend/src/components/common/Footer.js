// src/components/common/Footer.js
function Footer() {
  return (
    <footer style={{ padding: "10px", background: "#f5f5f5", textAlign: "center" }}>
      <p>&copy; {new Date().getFullYear()} MediTrack. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
