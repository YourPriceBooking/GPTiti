import React from 'react'; 
import Image from 'next/image'; 
import styles from './SectionGptTokens.module.css'; 
import { SectionGptTokensProps } from '@/types/types'; 
import { getModelGroupAndItem } from '@/functions/getModelGroupAndItem'; 
import Link from 'next/link'; 
import { useTokensContext } from '@/context/TokensContext'; 
import { TOKENS_SUFFIX } from '@/config/models.config'; 
import ModelGptitiTitleWithIcon from '@/components/ModelGptitiTitleWithIcon/ModelGptitiTitleWithIcon'; 
import { useAuth } from '@/context/AuthContext';
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import userStyles from "@/components/HomePage/LeftSide/SectionGptUser/SectionGptUser.module.css";

export default function SectionGptTokens(props: SectionGptTokensProps) 
{ const { modelRef, selectedModel, isModalOpen, setIsModalOpen } = props;
  const { balance } = useTokensContext(); 
  const { user, accessToken } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const isLoggedIn = Boolean(accessToken || user);
const result = getModelGroupAndItem(selectedModel); 
return ( 
<section className={styles.gptTokens}> 
  <article > 
    <div className={styles.gptMini}>
    <ModelGptitiTitleWithIcon modelRef={modelRef} 
    selectedModel={selectedModel} isModalOpen={isModalOpen} 
    setIsModalOpen={setIsModalOpen} />
    </div> 
    <p className={styles.paragraph}> 
      approximate asking price {result?.model.tokens} {TOKENS_SUFFIX} 
      </p> 
      </article> 
      
        {isLoggedIn ? (
        <article className={styles.gptBalance}> 
        <h2 className={styles.title2}>Balance</h2> 
          <div className={styles.balanceContainer}> 
            <span className={styles.gptSpan1}>{balance.toLocaleString()}</span> 
            <Image width={24} height={24} src="/icons/badge.svg" alt="badge" /> 
          </div>
      </article> 

        ) : (
          <button className={userStyles.loginBtnBlack} onClick={() => setIsLoginOpen(true)}>
            <span className={userStyles.loginBtnSpan}><span style={{fontSize: '28px', fontWeight: '700', marginRight: '8px',lineHeight: '28px'}}>G</span>Continue in with Google</span>
          </button>
        )}

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          
          <div className={styles.btnContainer}> 
            <Link href="/top-up-your-tokens"> 
            <button className={styles.btn}> 
              <div className={styles.iconWrapper}> 
                <Image width={33} height={33} src="/icons/circle-icon.svg" alt="circle-icon" /> 
                </div> 
                <span className={styles.btnSpan1}>Top up tokens</span> 
                </button> 
                </Link> 
                </div> 
                </section> ); }