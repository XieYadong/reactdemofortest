
import { request } from 'utils/helpers/http';
import {
  getAuldAPIEndpoint,
  // getUserAPIEndpoint,
  getMessageEndpoint
} from 'lib/options/api.options';
import { Portfolio } from 'lib/typings/portfolio.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';


import { useQuotes } from 'lib/hooks/use-quotes';


const PortfolioTermList: FunctionComponent = (props: any) => {
  //账户列表
  // const [userOptions, setUserOptions] = useUserOptions();
  const [macheins, setMacheins] = useState<Array<any>>(false);
  const [machein, setMachein] = useState<any>(false);
  //wss 接口写在里面了
      const { watch, unwatch, quotes } = useQuotes();
  useEffect(() => {
    loadmas();

  }, []);

  const loadmas = async () => {
    try {
      const { data} = await request(
        getAuldAPIEndpoint('/api/v1/machines/'),
      );
        setMacheins(data.event)
    } catch (err) {
    }
  };

  const handleGetitem= async () => {
    try {
      const { data } = await request(
        getAuldAPIEndpoint(`/api/v1/machines/${macheins[0]?.id}`),
       
      );
        setMachein(data)
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <p></p>
      <p></p>
      <p></p>
       
    </div>
  );
};

export default PortfolioTermList;
