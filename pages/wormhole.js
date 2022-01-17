import React, { useEffect, useState } from 'react';
const { connectToDatabase } = require('../server/database/mongodb')
import { Table, Tag, Input, Select  } from 'antd';
import WormholeModel from '../server/models/wormhole.model'
import axios from 'axios'
import Link from 'next/link';

function Wormhole({totalToken}) {
  const columnWormhole = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: '10%',
      sorter: (a, b) => a.key - b.key,
      render: (text, record, index) => text + 1,
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      width: '20%',
      sorter: (a, b) => a.symbol - b.symbol,
    },
    {
      title: 'Markets',
      dataIndex: 'market',
      key: 'market',
      render: (text, record) => {
        const markets = record.market
        return (
          <div className='flex flex-row flex-wrap'>
            {markets.map((market, index) => {
              let color = market.name.length > 5 ? 'geekblue' : 'green';
              return (
                <>
                  <Tag color={color} key={index}> 
                    <a target="_blank" href={market.link} > {market.name} </a>
                  </Tag>
                </>
              );
            })}
          </div>
        )
      }
    }
  ];  

  const [tableData, setTableData] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: totalToken })
  const [logInfo, setLogInfo] = useState("")

  const handleFetchToken = async (newPagination, sorter, curText) => {
    const limit = newPagination.pageSize
    const skip = (newPagination.current - 1)*limit
    
    let sort = {}
    if(sorter.order) sort[sorter.field] = sorter.order === 'descend' ? -1 : 1

    const res = await axios.post('/api/wormhole', {
      limit,
      skip,
      sort: sort,
      text: curText
    })
    const newData = res.data.tokens.map((t, index) => {
      return {
        key: skip + index,
        ...t
      }
    })
    setTableData(newData)
  }

  useEffect(() => {
    handleFetchToken(pagination, {}, "")
  }, [])

  const handleTableChange = (newPagination, filters, sorter) => {
    console.log(newPagination, filters, sorter)
    setPagination({...newPagination, total: totalToken})
    handleFetchToken(newPagination, sorter, inputValue)
  }
  
  const handleSearchToken = () => {
    handleFetchToken({...pagination, current: 1, pageSize: 10}, {}, inputValue)
  }

  return (
    <div className='flex flex-row justify-between items-start bg-gray-100 w-full h-full '>
      <div className='flex flex-col px-2'>
        <div className='my-4 text-base flex flex-row items-center justify-start '>
          <span>Search</span>
          <div className='border border-black rounded-lg h-9 flex flex-row items-stretch justify-start mx-2 overflow-hidden bg-white'>
            <input type='text' value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} className='outline-none mx-2' />
            <div onClick={handleSearchToken} className='px-3 flex items-center bg-green-500 hover:bg-green-700 cursor-pointer text-white'>Search</div>
          </div>
          <span>{logInfo}</span>
        </div>
        <div className=''>
          <Table
              pagination={pagination}
              columns={columnWormhole}
              dataSource={tableData}
              onChange={handleTableChange}
              scroll={{y: '85vh'}}
          />
        </div>
      </div>
    </div>
  );
}

export default Wormhole;

export async function getServerSideProps(context) {
  connectToDatabase()
  const total =  await WormholeModel.count({})
  console.log(total)
  return {
    props: {
        totalToken: total
    }, // will be passed to the page component as props
  }
}