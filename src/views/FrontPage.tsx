import React, { useContext, useEffect, useRef, useState } from 'react';
import { TreeContext, TreeState } from '../store/treeStore/treeStore';
import { getStateFromDb } from '../store/treeStore/indexedDbHelper';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import { mapToTreeState } from '../helpers/FhirToTreeStateMapper';
import Modal from '../components/Modal/Modal';
import SpinnerBox from '../components/Spinner/SpinnerBox';
import { useTranslation } from 'react-i18next';
import FormBuilder from './FormBuilder';
import Btn from '../components/Btn/Btn';
import './FrontPage.css';
import cardinalkitSpaceman from '../images/cardinalkit-spaceman.png';

const FrontPage = (): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const [stateFromStorage, setStateFromStorage] = useState<TreeState>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormBuilderShown, setIsFormBuilderShown] = useState<boolean>(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getStoredQuestionnaire();
    }, []);

    const getStoredQuestionnaire = async () => {
        const indexedDbState = await getStateFromDb();
        setStateFromStorage(indexedDbState);
    };

    const onReaderLoad = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            const questionnaireObj = JSON.parse(event.target.result as string);
            const importedState = mapToTreeState(questionnaireObj);
            dispatch(resetQuestionnaireAction(importedState));
            setIsLoading(false);
            setIsFormBuilderShown(true);
            // Reset file input
            if (uploadRef.current) {
                uploadRef.current.value = '';
            }
        }
    };

    const uploadQuestionnaire = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files && event.target.files[0]) reader.readAsText(event.target.files[0]);
    };
    const suggestRestore: boolean = stateFromStorage?.qItems ? Object.keys(stateFromStorage.qItems).length > 0 : false;

    const onDenyRestoreModal = (): void => {
        dispatch(resetQuestionnaireAction());
        setStateFromStorage(undefined);
    };

    const onConfirmRestoreModal = (): void => {
        dispatch(resetQuestionnaireAction(stateFromStorage));
        setStateFromStorage(undefined);
        setIsFormBuilderShown(true);
    };

    return (
        <>
            {suggestRestore && (
                <Modal title={t('Continue working?')} close={onDenyRestoreModal} size={'small'}>
                    <div>
                        <p>{t('It appears you were working on a survey:')}</p>
                        <div className="key-value">
                            <div>{t('Title')}</div>
                            <div>{stateFromStorage?.qMetadata.title}</div>
                        </div>
                        <div className="key-value">
                            <div>{t('Name')}</div>
                            <div>{stateFromStorage?.qMetadata.name}</div>
                        </div>
                        <div className="key-value">
                            <div>{t('Version')}</div>
                            <div>{stateFromStorage?.qMetadata.version}</div>
                        </div>
                        <p>{t('Do you want to continue working on it?')}</p>
                        <div className="modal-btn-bottom">
                            <div className="center-text">
                                <Btn title={t('Yes')} type="button" variant="primary" onClick={onConfirmRestoreModal} />{' '}
                                <Btn title={t('No')} type="button" variant="secondary" onClick={onDenyRestoreModal} />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {isLoading && (
                <Modal>
                    <div className="align-everything">
                        <SpinnerBox />
                    </div>
                    <p className="center-text">{t('Loading survey...')}</p>
                </Modal>
            )}
            {isFormBuilderShown ? (
                <FormBuilder />
            ) : (
                <>
                    <header>
                        <h1 className="form-title-frontpage">{`CardinalKit Survey Builder`}</h1>
                    </header>
                    <div className="frontpage">
                        <img src={cardinalkitSpaceman} alt="CardinalKit Spaceman" width="200" className="spaceman" />
                        <h2>{`Easily build an HL7® FHIR® survey for your CardinalKit iOS & Android applications!`}</h2>
                        <div className="frontpage__infotext">
                            {t('You can start a new survey, or upload and continue to work on an existing one.')}
                        </div>
                        <input
                            type="file"
                            ref={uploadRef}
                            onChange={uploadQuestionnaire}
                            accept="application/JSON"
                            style={{ display: 'none' }}
                        />
                        <Btn
                            onClick={() => {
                                setIsFormBuilderShown(true);
                            }}
                            title={t('Create New Survey')}
                            variant="primary"
                        />
                        <br />
                        <br />
                        <Btn
                            onClick={() => {
                                uploadRef.current?.click();
                            }}
                            title={t('Upload Existing Survey')}
                            variant="secondary"
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default FrontPage;
