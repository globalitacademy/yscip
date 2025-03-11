
import React from 'react';

const ResetEmailSentAlert: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
      <h3 className="font-medium mb-2">Հղումն ուղարկված է</h3>
      <p>Գաղտնաբառը վերականգնելու հղումը ուղարկվել է Ձեր էլ․ փոստին։</p>
      <p className="mt-2 text-sm">Խնդրում ենք ստուգել Ձեր էլ․ փոստը և հետևել հղմանը։ Եթե նամակը չի հայտնվում, ստուգեք նաև "սպամ" բաժինը։</p>
    </div>
  );
};

export default ResetEmailSentAlert;
