import {
	IonButton,
	IonCheckbox,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonPage,
	IonRow,
	IonToolbar,
} from '@ionic/react';
import styles from '../Home.module.scss';

import Card from '../../icons/card';
import Cards from '../../icons/cards';
import BackArrow from '../../icons/backArrow';
import Close from '../../icons/close';
import CustomField from '../../components/CustomField';
import { useCardFields } from '../../data/fields';
import { useEffect, useState } from 'react';
import { validateForm } from '../../data/utils';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router';
import { cardPayment, getApiKey } from 'swirepay-checkout';

const Checkout = () => {
	const params = useParams();
	let history = useHistory();
	const { id } = params;
	const fields = useCardFields();
	const [errors, setErrors] = useState(false);
	const [isActive, setIsActive] = useState(false);


	const makePayment = async () => {
		const errors = validateForm(fields);
		const name = (fields[0] && fields[0].input && fields[0].input.state && fields[0].input.state.value);
		const cardNum = (fields[1] && fields[1].input && fields[1].input.state && (fields[1].input.state.value).replace(/ /g, ""));
		const expiry = (fields[2] && fields[2].input && fields[2].input.state && fields[2].input.state.value);
		const cvvNum = (fields[3] && fields[3].input && fields[3].input.state && fields[3].input.state.value);
		const month = expiry && expiry.substring(0, 2);
		const year = expiry && expiry.substring(3);
		setErrors(errors);
		if (!errors.length) {
			try {
				const data = await cardPayment(
					100,
				'test@mail.com',
				'test',
				'+919940274492',
				null,
				name,
				cardNum,
				month,
				year,
				cvvNum,
				isActive
				);
				if (data && data.entity && data.entity.gid) {
					history.push('/sp-success');
				} else {
					history.push('/sp-failed');
				}
			} catch (err) {
				history.push('/sp-failed');
			}
		}
		
	};

	useEffect(() => {
		getApiKey(id);
		return () => {
			fields.forEach(field => field.input.state.reset(""));
			setErrors(false);
		}
	}, [params]);

	const checkChange = (e) => {
		setIsActive(e.detail.checked);
	}

	return (
		<IonPage className={styles.signupPage}>
			<IonHeader>
				<IonToolbar>

					<IonButtons slot="start">
						<IonButton className="custom-button">
							<BackArrow />
						</IonButton>
					</IonButtons>

					<IonButtons slot="end">
						<IonButton className="custom-button">
							<Close />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonGrid className="ion-padding">
					<IonRow>
						<IonCol size="12" className={styles.headingText}>
							<h5>Select Payment Method</h5>
							<p><Card /> Card</p>
							<h6>Debit card, Credit card and Corporate credit card are supported</h6>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol size="12">
							{fields.map(field => {
								return <CustomField field={field} errors={errors} />;
							})}
							<div class="ion-text-start" style={{ paddingBottom: '10px' }}>
								<IonCheckbox onIonChange={(e) => checkChange(e)}  checked={isActive} slot="start" style={{ border: '2px solid #000' }} /> <span>Save this Card</span>
							</div>
							<IonCheckbox onIonChange={(e) => checkChange(e)} slot="start" checked={isActive} />
							<h4>We don't store CVV, You can remove all the saved card later.</h4>
							<div class="ion-text-center">
								<Cards />
							</div>
							<IonButton className="custom-button" expand="block" onClick={makePayment}>PAY</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Checkout;