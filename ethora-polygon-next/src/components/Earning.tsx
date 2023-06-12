import { useState } from "react";
import {
  TrashIcon,
} from "@heroicons/react/24/outline";
import cn from "classnames"
import { v4 as uuidv4 } from 'uuid';

type Props = {
  setBens: (bens: Record<string, string>) => void;
  bens: Record<string, string>;
  percents: Record<string, string>;
  setPercents: (percents: Record<string, string>) => void;
}

export function Earning(props: Props) {
  const {bens, setBens, percents, setPercents} = props

  const onInput = (e, key) => {
    setBens({...bens, ...{[key]: e.target.value}})
  }

  const addNewAddressInput = () => {
    setBens({...bens, ...{[uuidv4()]: '0x'}})
  }

  const removeAddressInput = (key) => {
    delete bens[key];
    setBens({...bens})
  }

  const onPercent = (e, key) => {
    setPercents({...percents, ...{[key]: e.target.value}})
  }

  return (
    <div>
      <p className="required mb-2 text-[16px] font-bold">Earnings</p>
      <p className="text-gray-500 text-[14px] mb-2">
        Specify wallet addresses and percents that they get from the paid token
        mint.
      </p>
      {Object.keys(bens).map((key, index) => {
        return (
          <p className="mb-2 flex" key={key}>
            <input
              value={bens[key]}
              onChange={(e) => onInput(e, key)}
              type="text"
              placeholder="0x... address"
              className="border p-5 mr-2 grow rounded-md"
            />
            <input
              type="number"
              placeholder="%"
              onChange={(e) => onPercent(e, key)}
              className={cn("w-[100px] p-5 mr-2 pr-[31px] border rounded-md")}
            />
            <button className="disabled:opacity-50 disabled:cursor-not-allowed" disabled={Object.keys(bens).length === 1} onClick={(e) => removeAddressInput(key)}><TrashIcon className="w-[24px] h-[24px]" /></button>
          </p>
        );
      })}
      <button onClick={addNewAddressInput} className="text-blue-600 mb-4">Add new address</button>
    </div>
  );
}
