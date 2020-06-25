import React, { useState, useEffect } from 'react'
import './styles.css'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api';

import logoImg from '../../assets/logo.svg'

export default function Profile() {
    const history = useHistory();
    const [incidents, setIncidentes] = useState([]);
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then(response => {
            setIncidentes(response.data);
        })
    }, [ongId]);
    
    async function handleDeleteIncidet(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            })
            
            setIncidentes(incidents.filter( incident => incident.id !== id ));
        }catch(err) {
            alert('Erro ao deletar caso, tente novamente.')
        }
    }
    
    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }
    
    return (
        <div className="profile-container">
        <header>
        <img src={ logoImg } alt="Be the Hero"/>
        <span>Bem vinda, { ongName }</span>
        
        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
        <FiPower size={ 18 } color="#e02041"></FiPower>
        </button>
        </header>
        
        <h1>Casos cadastrados</h1>
        
        <ul>
        {    
            incidents.map( incident => {
                return (
                    <li key={incident.id}>
                    <strong>Caso: </strong>
                    <p>{incident.title}</p>
                    
                    <strong>Descrição: </strong>
                    <p>{incident.description}</p>
                    
                    <strong>Valor: </strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>
                    
                    <button onClick={ () => handleDeleteIncidet(incident.id) } type="button">
                    <FiTrash2 size={20} color='#a8a8b3'></FiTrash2>
                    </button>
                    </li>
                    )
                })
            }
            </ul>
            </div>
            )
        }