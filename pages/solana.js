import React, { useEffect, useState } from 'react';
import { connectToDatabase } from '../server/database/mongodb'
import { Table, Tag, Input, Select  } from 'antd';
import TokenModel from '../server/models/token.model'
import TagModel from '../server/models/tag.model'
import axios from 'axios'
import { PythConnection } from '../pyth/PythConnection.ts'
import { getPythProgramKeyForCluster } from '../pyth/cluster.ts'
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

const { Option } = Select;

function Token({totalToken, tagList}) {
    const columnSolana = [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          width: '10%',
          sorter: (a, b) => a.key - b.key,
          render: (text, record, index) => text + 1,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name - b.name,
        },
        {
          title: 'Symbol',
          dataIndex: 'symbol',
          key: 'symbol',
          width: '20%',
          sorter: (a, b) => a.symbol - b.symbol,
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: '20%',
          sorter: (a, b) => a.price - b.price,
        },
        {
          title: 'Tags',
          dataIndex: 'tag',
          key: 'tag',
          render: (text, record) => {
            const tags = record.tag
            return (
              <div className='flex flex-row flex-wrap'>
                {tags.map((tag, index) => {
                  let color = tag.length > 5 ? 'geekblue' : 'green';
                  return (
                    <>
                      <Tag color={color} key={index} > 
                        {tag}
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
    const [currentTag, setCurrentTag] = useState("")
    const [logInfo, setLogInfo] = useState("")
    const [priceObj, setPriceObj] = useState({})

    useEffect(() => {
      // const newData = tableData.map(d => {
      //   if(priceObj[d.symbol] !== undefined) return {
      //     ...d,
      //     price: priceObj[d.symbol]
      //   }
      //   return d
      // })
      setTableData(tableData => tableData.map(d => {
        if(priceObj[d.symbol] !== undefined) return {
          ...d,
          price: priceObj[d.symbol]
        }
        return d
      }))
    }, [priceObj])

    useEffect(() => {
      handleFetchToken(pagination, {}, "", "")
      const SOLANA_CLUSTER_NAME = 'devnet'
        const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER_NAME))
        const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME)
        const pythConnection = new PythConnection(connection, pythPublicKey)
        let newPrice = {}
        pythConnection.onPriceChange((product, price) => {
        // sample output:
        // SRM/USD: $8.68725 ??$0.0131
            if (price.price && price.confidence) {
                // tslint:disable-next-line:no-console
                // console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
                // setData(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
                // console.log(JSON.stringify(product))
                newPrice[product.base] = price.price
                // console.log(Object.keys(newPrice).length)
                setPriceObj({...newPrice})
            } else {
                // tslint:disable-next-line:no-console
                // console.log(`${product.symbol}: price currently unavailable`)
            }
        })

        // tslint:disable-next-line:no-console
        console.log('Reading from Pyth price feed...')
        pythConnection.start()
    }, [])
    
    const onChangeTag = (value) => {
      console.log(value)
      setCurrentTag(value)
      handleFetchToken({...pagination, current: 1, pageSize: 10}, {}, value, inputValue)
    }

    
    const handleTableChange = (newPagination, filters, sorter) => {
      console.log(newPagination, filters, sorter)
      setPagination({...newPagination, total: totalToken})
      handleFetchToken(newPagination, sorter, currentTag, inputValue)
    }
    
    const handleSearchToken = () => {
      handleFetchToken({...pagination, current: 1, pageSize: 10}, {}, currentTag, inputValue)
    }
    
    const handleFetchToken = async (newPagination, sorter, curTag, curText) => {
      const limit = newPagination.pageSize
      const skip = (newPagination.current - 1)*limit
      
      let sort = {}
      if(sorter.order) sort[sorter.field] = sorter.order === 'descend' ? -1 : 1

      const res = await axios.post('/api/solana/token', {
        limit,
        skip,
        sort: sort,
        text: curText,
        tag: curTag
      })
      console.log(res.data.tokens)
      const newData = res.data.tokens.map((t, index) => {
        return {
          key: skip + index,
          ...t
        }
      })
      setTableData(newData)
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
            <div className='w-80 flex flex-row items-center'>
              <span className='px-2'>Filter tag</span>
              <Select
                showSearch
                placeholder="Select tag"
                optionFilterProp="children"
                onChange={onChangeTag}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {tagList.map((t, index) => {
                  return <Option key={index} value={t.name}>{t.name}</Option>
                }).concat([<Option key={tagList.length} value="">All</Option>])}
              </Select>
            </div>
          </div>
          <div className=''>
            <Table
                pagination={pagination}
                columns={columnSolana}
                dataSource={tableData}
                onChange={handleTableChange}
                scroll={{y: '85vh'}}
            />
          </div>
        </div>
      </div>
    );
}

export default Token;

export async function getServerSideProps(context) {
  connectToDatabase()
  const [total, tag] = await Promise.all([
    TokenModel.count({}),
    TagModel.find({}),
]) 
  console.log(total, tag.length)
  return {
    props: {
        totalToken: total,
        tagList: JSON.parse(JSON.stringify(tag))
    }, // will be passed to the page component as props
  }
}