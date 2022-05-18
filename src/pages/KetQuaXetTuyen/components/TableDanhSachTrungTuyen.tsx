import TableBase from '@/components/Table';
import RaSoatHoSoNhapHoc from '@/pages/HoSoThiSinh/NhapHoc/RaSoatHoSo';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import {
  ETrangThaiNhapHoc,
  ETrangThaiXacNhanNhapHoc,
  MapKeyColorTrangThaiNhapHoc,
  MapKeyColorTrangThaiXacNhanNhapHoc,
} from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  DollarOutlined,
  LockOutlined,
  PrinterOutlined,
  SwapOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import ViewHoSoTrungTuyen from './ViewKetQua';
import { useEffect, useState } from 'react';
import FormChuyenDotNhapHoc from './FormChuyenDotNhapHoc';

const TableDanhSachTrungTuyen = (props: {
  idCoSo?: string;
  children?: any;
  paramCondition?: any;
  hideTrangThai?: boolean;
  type: 'nhaphoc' | 'xacnhannhaphoc';
}) => {
  const {
    page,
    limit,
    condition,
    loading,
    getKetQuaXetTuyenPageableModel,
    setVisibleForm,
    setRecord: setRecordKetQuaXetTuyen,
    visibleForm,
    adminTiepNhanHoSoNhapHocModel,
    adminTiepNhanXacNhanNhapHocModel,
  } = useModel('ketquaxettuyen');

  const { getAllModel } = useModel('dotnhaphoc');
  useEffect(() => {
    if (props.type === 'nhaphoc') {
      getAllModel();
    }
  }, []);

  const [visibleFormChuyenDot, setVisibleFormChuyenDot] = useState<boolean>(false);

  const { record: recordDotTuyenSinh } = useModel('dottuyensinh');

  const { record } = useModel('hinhthucdaotao');
  const { record: recordNamTuyenSinh } = useModel('namtuyensinh');
  const { adminGetHuongDanNhapHocByKetQuaXetTuyenModel } = useModel('huongdannhaphoc');

  const onCell = (recordKetQua: KetQuaXetTuyen.Record) => ({
    onClick: async () => {
      if (props.type === 'nhaphoc')
        await adminGetHuongDanNhapHocByKetQuaXetTuyenModel(recordKetQua._id);
      setVisibleForm(true);
      setRecordKetQuaXetTuyen(recordKetQua);
    },
    style: { cursor: 'pointer' },
  });

  const onCancelFormChuyenDot = () => {
    setVisibleFormChuyenDot(false);
  };

  const getData = () =>
    getKetQuaXetTuyenPageableModel(
      recordDotTuyenSinh?._id ?? '',
      props?.idCoSo,
      props?.paramCondition,
    );

  const columns: IColumn<KetQuaXetTuyen.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      onCell,
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      width: 120,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Trạng thái',
      dataIndex: ['thongTinXacNhanNhapHoc', 'trangThaiXacNhan'],
      width: 220,
      columnKey: 'thongTinXacNhanNhapHoc.trangThaiXacNhan',
      key: 'thongTinXacNhanNhapHoc.trangThaiXacNhan',
      align: 'center',
      search: 'filterString',
      notRegex: true,
      onCell,
      hide: props.hideTrangThai || props.type === 'nhaphoc',
      render: (val) => <Tag color={MapKeyColorTrangThaiXacNhanNhapHoc[val]}>{val}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiNhapHoc',
      width: 220,
      align: 'center',
      search: 'filterString',
      notRegex: true,
      onCell,
      hide: props.hideTrangThai || props.type === 'xacnhannhaphoc',
      render: (val) => <Tag color={MapKeyColorTrangThaiNhapHoc[val]}>{val}</Tag>,
    },
    {
      title: 'Họ đệm',
      dataIndex: ['thongTinThiSinh', 'hoDem'],
      width: 120,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Tên',
      dataIndex: ['thongTinThiSinh', 'ten'],
      width: 100,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Đợt nhập học',
      dataIndex: ['idDotNhapHoc', 'tenDot'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Loại đối tượng',
      dataIndex: 'loaiDoiTuong',
      width: 200,
      align: 'center',
      render: (val: string[]) => (
        <div>
          {val.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      ),
      onCell,
    },
    {
      title: 'Số CMND/CCCD',
      dataIndex: ['thongTinThiSinh', 'cmtCccd'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Email',
      dataIndex: ['thongTinThiSinh', 'email'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Mã thanh toán',
      dataIndex: 'identityCodeNhapHoc',
      width: 200,
      align: 'center',
      search: 'search',
      hide: props?.paramCondition?.trangThaiNhapHoc === ETrangThaiNhapHoc.CHUA_KHOA,
      onCell,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToanNhapHoc',
      width: 200,
      align: 'center',
      search: 'filterString',
      notRegex: true,
      hide: props?.paramCondition?.trangThaiNhapHoc === ETrangThaiNhapHoc.CHUA_KHOA,
      onCell,
    },
    {
      title: 'Địa chỉ liên hệ',
      dataIndex: ['thongTinThiSinh', 'diaChiLienHe'],
      width: 200,
      align: 'center',
      render: (val: DonViHanhChinh.Record) => {
        return (
          <div>
            {[val?.diaChi, val?.tenXaPhuong, val?.tenQH, val?.tenTP]
              ?.filter((item) => item !== undefined && item !== '')
              ?.join(', ')}
          </div>
        );
      },
      onCell,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: ['nguyenVongTrungTuyen', 'tenCoSoDaoTao'],
      width: 200,
      align: 'center',
      search: 'search',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      hide: props.type === 'xacnhannhaphoc',
      render: (recordHoSo: KetQuaXetTuyen.Record) => (
        <>
          {recordHoSo?.trangThaiNhapHoc === ETrangThaiNhapHoc.CHUA_KHOA &&
            props.type === 'nhaphoc' && (
              <>
                <Tooltip title="Chuyển đợt nhập học">
                  <Button
                    onClick={() => {
                      setRecordKetQuaXetTuyen(recordHoSo);
                      setVisibleFormChuyenDot(true);
                    }}
                    shape="circle"
                    icon={<SwapOutlined />}
                  />
                </Tooltip>

                <Divider type="vertical" />
              </>
            )}
          {[
            ETrangThaiNhapHoc.CHUA_KHOA,
            ETrangThaiNhapHoc.DA_TIEP_NHAN,
            ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA,
          ].includes(recordHoSo?.trangThaiNhapHoc) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn khóa hồ sơ này"
              onConfirm={() =>
                adminTiepNhanHoSoNhapHocModel(
                  recordDotTuyenSinh?._id ?? '',
                  recordHoSo._id,
                  {
                    trangThaiNhapHoc: ETrangThaiNhapHoc.DA_KHOA,
                  },
                  getData,
                )
              }
            >
              <Tooltip title="Khóa">
                <Button type="primary" icon={<LockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiNhapHoc.DA_KHOA].includes(recordHoSo?.trangThaiNhapHoc) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn mở khóa hồ sơ này"
              onConfirm={() =>
                adminTiepNhanHoSoNhapHocModel(
                  recordDotTuyenSinh?._id ?? '',
                  recordHoSo._id,
                  {
                    trangThaiNhapHoc: ETrangThaiNhapHoc.CHUA_KHOA,
                  },
                  getData,
                )
              }
            >
              <Tooltip title="Mở khóa">
                <Button type="primary" icon={<UnlockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiNhapHoc.DA_KHOA, ETrangThaiNhapHoc.DA_TIEP_NHAN]?.includes(
            recordHoSo?.trangThaiNhapHoc,
          ) && (
            <>
              <Divider type="vertical" />
              <Tooltip title="Thanh toán">
                <Button
                  // onClick={() => {
                  //   setRecordHoSo(recordHoSo);
                  //   setVisibleThanhToan(true);
                  // }}
                  type="primary"
                  icon={<DollarOutlined />}
                  shape="circle"
                />
              </Tooltip>
            </>
          )}

          <Divider type="vertical" />
          <Tooltip title="In hồ sơ">
            <Button
              // onClick={() => {
              //   adminExportPhieuDangKyModel(recordHoSo._id, recordHoSo?.maHoSo);
              // }}
              icon={<PrinterOutlined />}
              shape="circle"
            />
          </Tooltip>
        </>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      hide: props.type === 'nhaphoc',
      render: (recordHoSo: KetQuaXetTuyen.Record) => (
        <>
          {[
            ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
            ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
            ETrangThaiXacNhanNhapHoc.KHONG_TIEP_NHAN,
          ].includes(recordHoSo?.thongTinXacNhanNhapHoc?.trangThaiXacNhan) && (
            <Popconfirm
              title="Bạn có chắc chắc xác nhận không nhập học cho hồ sơ này"
              onConfirm={() =>
                adminTiepNhanXacNhanNhapHocModel(
                  recordHoSo?._id ?? '',
                  {
                    trangThaiXacNhan: ETrangThaiXacNhanNhapHoc.KHONG_XAC_NHAN,
                  },
                  recordDotTuyenSinh?._id ?? '',
                  props?.idCoSo,
                )
              }
            >
              <Tooltip title="Xác nhận không nhập học">
                <Button type="primary" icon={<LockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}

          {[ETrangThaiXacNhanNhapHoc.XAC_NHAN, ETrangThaiXacNhanNhapHoc.KHONG_XAC_NHAN].includes(
            recordHoSo?.thongTinXacNhanNhapHoc?.trangThaiXacNhan,
          ) && (
            <Popconfirm
              title="Bạn có chắc chắc muốn chuyển trạng thái chưa xác nhận nhập học cho hồ sơ này"
              onConfirm={() =>
                adminTiepNhanXacNhanNhapHocModel(
                  recordHoSo?._id ?? '',
                  {
                    trangThaiXacNhan: ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
                  },
                  recordDotTuyenSinh?._id ?? '',
                  props?.idCoSo,
                )
              }
            >
              <Tooltip title="Chuyển về chưa xác nhận nhập học">
                <Button icon={<UnlockOutlined />} shape="circle" />
              </Tooltip>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  // const khoiTaoAll = useCheckAccess('danh-sach-trung-tuyen:khoi-tao-all');

  return (
    <TableBase
      otherProps={{ scroll: { x: 1200 } }}
      hideCard
      getData={getData}
      modelName="ketquaxettuyen"
      loading={loading}
      columns={columns}
      dependencies={[
        page,
        limit,
        condition,
        recordDotTuyenSinh?._id,
        recordNamTuyenSinh?._id,
        record?._id,
        props.idCoSo,
      ]}
    >
      <Modal
        width={1100}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        {props.type === 'nhaphoc' ? (
          <RaSoatHoSoNhapHoc />
        ) : (
          <ViewHoSoTrungTuyen idCoSo={props.idCoSo} />
        )}
      </Modal>
      <Modal
        destroyOnClose
        footer={false}
        visible={visibleFormChuyenDot}
        onCancel={onCancelFormChuyenDot}
        bodyStyle={{ padding: 0 }}
      >
        <FormChuyenDotNhapHoc
          onCancel={onCancelFormChuyenDot}
          paramCondition={props?.paramCondition}
        />
      </Modal>
      {props?.children}
    </TableBase>
  );
};

export default TableDanhSachTrungTuyen;
