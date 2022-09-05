import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../store/treeStore/treeStore';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import Navbar from '../components/Navbar/Navbar';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';
import Modal from '../components/Modal/Modal'
import './FormBuilder.css';
import { ValidationErrors } from '../helpers/orphanValidation';
import TranslationModal from '../components/Languages/Translation/TranslationModal';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import FormField from '../components/FormField/FormField'
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { createUrlUUID } from '../helpers/uriHelper';
import Btn from '../components/Btn/Btn';

type FormBuilderProps = {
    close: () => void
}

const FormBuilder = (props: FormBuilderProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [showFormDetails, setShowFormDetails] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Array<ValidationErrors>>([]);
    const [translationErrors, setTranslationErrors] = useState<Array<ValidationErrors>>([]);
    const [translateLang, setTranslateLang] = useState('');
    const [url, setURL] = useState('');

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);


    const updateMeta = (
        propName: IQuestionnaireMetadataType,
        value: string,
    ) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <>
            <Navbar
                showFormFiller={() => setShowPreview(!showPreview)}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                translationErrors={translationErrors}
                setTranslationErrors={setTranslationErrors}
                toggleFormDetails={toggleFormDetails}
                close={props.close}
            />
            <div className="editor">
                { state.qMetadata.url ? (
                <AnchorMenu
                    dispatch={dispatch}
                    qOrder={state.qOrder}
                    qItems={state.qItems}
                    qCurrentItem={state.qCurrentItem}
                    validationErrors={validationErrors}
                />
                ) : (
                    <div className="metadata-message-container">
                        <p className="metadata-message-header">
                            <i className="ion-android-hand" />&nbsp; Let's start building a survey!
                        </p>
                        <hr />
                        <p>Please choose a unique URL to identify this survey. This doesn't have to be a real address on the web.
                            (We've filled in one for you, if you don't have one yet.)
                        </p>
                        <FormField>
                            <input
                             style={{color: 'black'}}
                             defaultValue={state.qMetadata.url || createUrlUUID()}
                             placeholder={t('Enter a unique URL for your survey here')}
                             onBlur={(e) => setURL(e.target.value)}
                             pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                            />
                        </FormField>
                        <Btn
                            onClick={() => {
                                updateMeta(IQuestionnaireMetadataType.url, url);
                            }}
                            title={t('Save')}
                            variant="primary"
                        />
                    </div>
                )}
                {translateLang && (
                    <TranslationModal close={() => setTranslateLang('')} targetLanguage={translateLang} />
                )}
            </div>
            <div className="page-wrapper">
                {(showFormDetails) &&
                    <Modal size={'large'}
                        title={'Survey Metadata'}
                        close={toggleFormDetails}
                        bottomCloseText={'Save'}
                        bottomButtonAlignment={'right-text'}>
                        <MetadataEditor />
                    </Modal>
                }
                <QuestionDrawer validationErrors={validationErrors} />
            </div>
        </>
    );
};

export default FormBuilder;
