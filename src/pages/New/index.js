import { useState, useEffect, useContext } from 'react';
import './new.css';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

export default function New() {
  const { id } = useParams();
  const history = useHistory();

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [idCustomer, setIdCustomer] = useState(false);

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

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoadingCustomers(false);
          setCustomers([{ id: '1', nomeFantasia: '' }]);
        });
    }

    loadCustomers();
  }, [id]);

  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }

  async function loadId(lista) {
    await firebase
      .firestore()
      .collection('chamados')
      .doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        const index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId,
        );
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        console.log('Erro no id passado: ', error);
        setIdCustomer(false);
      });
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      await firebase
        .firestore()
        .collection('chamados')
        .doc(id)
        .update({
          cliente: customers[customerSelected].nomeFantasia,
          clienteId: customers[customerSelected].id,
          assunto,
          status,
          complemento,
          userId: user.uid,
        })
        .then(() => {
          toast.success('Chamado editado com sucesso!');
          setCustomerSelected(0);
          setComplemento('');
          history.push('/dashboard');
        })
        .catch((error) => {
          toast.error('Ops, erro ao registrar. Tente novamente mais tarde');
          console.log(error);
        });
      return;
    }

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
              <select value={customerSelected} onChange={handleChangeCustomers}>
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
              <option value="Visita Tecnica">Visita Tecnica</option>
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
              <span>Em Aberto</span>

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
              placeholder="Descreva seu problema (opcional)."
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
