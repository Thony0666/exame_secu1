import  { useState } from "react";
import { useCaptcha } from "../../hooks"; 
import styles from "./Home.module.css"; 

export default function Home() {
  const [sequence, setSequence] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { renderCaptcha } = useCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const N = parseInt(e.target.number.value, 10);

    if (isNaN(N) || N < 1 || N > 1000) {
      setError("Veuillez entrer un nombre entre 1 et 1000.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setSequence([]);
    let count = 1;

    while (count <= N) {
      try {
        setSequence((prev) => [...prev, `${count}. Forbidden`]);
        count++;
      } catch (err) {
        if (err.response?.status === 405) {
          try {
            await renderCaptcha(); 
          } catch {
            setError("Échec du CAPTCHA.");
            break;
          }
        } else {
          setError("Une erreur s'est produite. Réessayez.");
          break;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {!isSubmitting ? (
        <form onSubmit={handleSubmit}>
          <label>
            Entrez un nombre (1-1000) :{" "}
            <input type="number" name="number" min="1" max="1000" required />
          </label>
          <button type="submit" className="btn">Générer</button>
        </form>
      ) : (
        <div>
          <p className={styles.loading}>Génération en cours...</p>
          <ul>
            {sequence.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}


    </div>
  );
}
