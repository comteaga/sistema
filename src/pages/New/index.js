import { useState, useEffect, useContext } from 'react';
import './new.css';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

export default function New() {
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCustomers() {
      await firebase
        .firestore()
        .collection('customers')
        .get()
        .then((snapshot) => {
          const lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });

          if (lista.length === 0) {
            console.log('Nenhuma emrpesa encontrada');
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }]);
            setLoadingCustomers(false);
            return;
          }

          setCustomers(lista);
          setLoadingCustomers(false);
        })
        .catch((error) => {
          console.log(error);
          setLoadingCustomers(false);
          setCustomers([{ id: '1', nomeFantasia: '' }]);
        });
    }

    loadCustomers();
  }, []);

  function hancleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();
    await firebase
      .firestore()
      .collection('chamados')
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto,
        status,
        complemento,
        userId: user.uid,
      })
      .then(() => {
        toast.success('Chamado criado com sucesso!');
        setComplemento('');
        setCustomerSelected(0);
      })
      .catch((err) => {
        toast.error('Ops, erro ao registrar. Tente novamente mais tarde!');
        console.log(err);
      });
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadingCustomers ? (
              <input type="text" disabled value="Carregando clientes..." />
            ) : (
              <select value={customerSelected} onChange={hancleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita tecnnica">Visita técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opicional)."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
