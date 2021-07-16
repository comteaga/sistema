import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/auth';

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    //preventDefault faz com que a página não seja recarregada
    e.preventDefault();

    if (nome !== '' && email !== '' && password !== '') {
      signUp(email, password, nome);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="Logo do Sistema" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input
            type="text"
            placeholder="Seu Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? 'Carregando...' : 'Acessar'}
          </button>
        </form>

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default SignUp;
